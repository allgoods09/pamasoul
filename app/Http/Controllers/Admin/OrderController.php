<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\OrderStatusNotification;
use App\Models\Order;
use App\Models\Setting;
use App\Support\CsvDownload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    // List orders
    public function index(Request $request)
    {
        $query = $this->filteredOrders($request);

        $orders = $query->withCount('items')->latest()->paginate(15)->withQueryString();

        $statusCounts = [
            'Pending' => Order::where('status', 'Pending')->count(),
            'Paid' => Order::where('status', 'Paid')->count(),
            'Shipped' => Order::where('status', 'Shipped')->count(),
            'Completed' => Order::where('status', 'Completed')->count(),
        ];

        return inertia('Admin/Orders/Index', [
            'orders' => $orders,
            'statusCounts' => $statusCounts,
            'shippingConfig' => $this->getShippingConfig(),
            'filters' => $request->only(['status', 'date_from', 'date_to', 'search']),
        ]);
    }

    private function filteredOrders(Request $request)
    {
        $request->validate(['status' => 'nullable|in:Pending,Paid,Shipped,Completed', 'search' => 'nullable|string|max:150', 'date_from' => 'nullable|date_format:Y-m-d', 'date_to' => 'nullable|date_format:Y-m-d']);
        if ($request->filled('date_from') && $request->filled('date_to') && $request->date_from > $request->date_to) {
            throw ValidationException::withMessages(['date_to' => 'End date must be on or after the start date.']);
        }
        $query = Order::with('user');

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Search by numeric ID, displayed order reference, or customer name
        if ($request->filled('search')) {
            preg_match('/^(?:PS-\d{4}-)?0*(\d+)$/i', $request->search, $matches);
            $orderId = $matches[1] ?? null;
            $query->where(function ($q) use ($request, $orderId) {
                $q->where('id', $orderId)
                    ->orWhereHas('user', function ($user) use ($request) {
                        $user->where('name', 'LIKE', "%{$request->search}%");
                    });
            });
        }

        return $query;
    }

    public function updateShippingSettings(Request $request)
    {
        $validated = $request->validate([
            'free_threshold' => 'required|numeric|min:0|max:999999.99|decimal:0,2',
            'base_fee' => 'required|numeric|min:0|max:99999.99|decimal:0,2',
        ]);

        DB::transaction(function () use ($validated) {
            Setting::set('shipping.free_threshold', $validated['free_threshold'], 'shipping');
            Setting::set('shipping.base_fee', $validated['base_fee'], 'shipping');
        });

        return redirect()->back()->with('success', 'Shipping settings updated successfully');
    }

    // View single order
    public function show(Order $order)
    {
        $order->load('user', 'items.product');

        return inertia('Admin/Orders/Show', [
            'order' => $order,
            'shippingConfig' => $this->getShippingConfig(),
        ]);
    }

    // Update order status
    public function updateStatus(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:Pending,Paid,Shipped,Completed',
        ]);

        DB::transaction(function () use ($order, $validated) {
            $locked = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();
            if (! $locked->updateStatus($validated['status'])) {
                throw ValidationException::withMessages(['status' => 'This status transition is not allowed. Refresh to see the current order status.']);
            }
        });

        return back()->with('success', 'Order status updated to '.$validated['status'].'.');
    }

    public function bulkUpdateStatus(Request $request)
    {
        $data = $request->validate(['ids' => 'required|array|min:1|max:100', 'ids.*' => 'required|integer|distinct|exists:orders,id', 'status' => 'required|in:Pending,Paid,Shipped,Completed']);
        DB::transaction(function () use ($data) {
            $orders = Order::whereIn('id', $data['ids'])->orderBy('id')->lockForUpdate()->get();
            foreach ($orders as $order) {
                if (! in_array($data['status'], $order->allowed_statuses, true)) {
                    throw ValidationException::withMessages(['status' => "Order #{$order->id} cannot move from {$order->status} to {$data['status']}. No orders were changed."]);
                }
            }
            foreach ($orders as $order) {
                $order->updateStatus($data['status']);
            }
        });

        return back()->with('success', count($data['ids']).' orders updated to '.$data['status'].'.');
    }

    public function export(Request $request)
    {
        $orders = $this->filteredOrders($request)->orderBy('id')->lazy();
        $rows = $orders->map(fn ($o) => [$o->reference, $o->user?->name, $o->user?->email, $o->status, $o->payment_method, $o->shipping_address, $o->shipping_fee, $o->total, (string) $o->created_at]);

        return CsvDownload::make('orders.csv', ['Reference', 'Customer', 'Email', 'Status', 'Payment method', 'Shipping address', 'Shipping fee (PHP)', 'Total (PHP)', 'Created at'], $rows);
    }

    // Generate invoice (PDF - future)
    public function invoice($id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);

        // Return PDF view or HTML invoice
        return inertia('Admin/Orders/Invoice', [
            'order' => $order,
        ]);
    }

    public function sendStatusEmail($id)
    {
        $order = Order::with(['user', 'items.product'])->findOrFail($id);

        if (! $order->user || ! $order->user->email) {
            return back()->with('error', 'No email address found');
        }

        if (in_array(config('mail.default'), ['log', 'array'])) {
            throw ValidationException::withMessages(['email' => 'Email delivery is not configured. Configure a delivery mailer before sending customer notifications.']);
        }
        try {
            Mail::to($order->user->email)->send(new OrderStatusNotification($order));
        } catch (\Throwable $exception) {
            report($exception);
            throw ValidationException::withMessages(['email' => 'The email service could not send this notification. Please try again later.']);
        }

        return back()->with('success', 'Email sent successfully');
    }
}
