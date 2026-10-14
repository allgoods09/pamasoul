<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\Setting;
use App\Models\User;
use App\Support\SalesSeries;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CommerceTest extends TestCase
{
    use RefreshDatabase;

    private User $customer;

    private User $admin;

    private Category $rods;

    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();
        Setting::set('shipping.base_fee', 50);
        Setting::set('shipping.free_threshold', 5000);
        $this->customer = User::factory()->create(['role' => 'customer']);
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->rods = Category::create(['name' => 'Fishing Rods']);
        Category::create(['name' => 'Reels']);
        Category::create(['name' => 'Fishing Lines']);
        $this->product = Product::create(['name' => 'Carbon Spinning Rod', 'description' => 'Medium power spinning rod.', 'price' => '1200.50', 'stock' => 8, 'category_id' => $this->rods->id]);
    }

    private function cart(int $quantity = 2)
    {
        $cart = $this->customer->cart()->create();

        return $cart->items()->create(['product_id' => $this->product->id, 'quantity' => $quantity, 'price_snapshot' => $this->product->price]);
    }

    private function checkout($item): array
    {
        $response = $this->actingAs($this->customer)->withSession(['selected_cart_items' => [$item->id]])->get('/checkout');
        $response->assertOk();
        $token = $response->inertiaProps('checkoutToken');

        return ['recipient' => 'Ana Reyes', 'phone' => '09171234567', 'street' => '12 Coastal Road', 'barangay' => 'Poblacion', 'city' => 'Tubigon', 'province' => 'Bohol', 'postal_code' => '6329', 'payment_method' => 'COD', 'checkout_token' => $token];
    }

    private function order(string $status = 'Pending', string $payment = 'COD'): Order
    {
        $order = $this->customer->orders()->create(['status' => $status, 'total' => '1250.50', 'shipping_fee' => '50.00', 'payment_method' => $payment, 'shipping_address' => 'Tubigon, Bohol']);
        $order->items()->create(['product_id' => $this->product->id, 'product_name' => $this->product->name, 'quantity' => 1, 'price_snapshot' => $this->product->price]);

        return $order;
    }

    public function test_catalog_combines_search_category_price_and_sort_and_includes_sold_out_products(): void
    {
        Product::create(['name' => 'Carbon Surf Rod', 'price' => 1500, 'stock' => 0, 'category_id' => $this->rods->id]);
        $this->get('/shop?search=Carbon&category=fishing-rods&min_price=1000&max_price=1600&sort=price_high')->assertInertia(fn (Assert $page) => $page->component('Customer/Shop/Index')->where('products.total', 2)->where('products.data.0.name', 'Carbon Surf Rod')->where('products.data.0.stock_status', 'Out of Stock')->where('filters.sort', 'price_high'));
    }

    public function test_catalog_pagination_keeps_all_filters(): void
    {
        for ($i = 0; $i < 13; $i++) {
            Product::create(['name' => 'Carbon Rod '.$i, 'price' => 1000 + $i, 'stock' => 2, 'category_id' => $this->rods->id]);
        }
        $this->get('/shop?search=Carbon&category=fishing-rods&sort=price_low&page=2')->assertInertia(fn (Assert $page) => $page->where('products.total', 14)->where('products.current_page', 2)->has('products.data', 2)->where('products.prev_page_url', fn ($url) => str_contains($url, 'search=Carbon') && str_contains($url, 'category=fishing-rods') && str_contains($url, 'sort=price_low')));
    }

    public function test_invalid_catalog_price_range_is_rejected(): void
    {
        $this->get('/shop?min_price=2000&max_price=100')->assertSessionHasErrors('max_price');
    }

    public function test_invalid_category_does_not_show_unfiltered_catalog(): void
    {
        $this->get('/shop?category=unknown')->assertInertia(fn (Assert $page) => $page->where('products.total', 0));
    }

    public function test_authenticated_cart_add_updates_existing_line_and_stock_limits(): void
    {
        $this->actingAs($this->customer)->post('/cart/add', ['product_id' => $this->product->id, 'quantity' => 2])->assertSessionHas('success');
        $this->post('/cart/add', ['product_id' => $this->product->id, 'quantity' => 3])->assertSessionHas('success');
        $this->assertDatabaseCount('cart_items', 1);
        $this->assertDatabaseHas('cart_items', ['quantity' => 5]);
        $this->post('/cart/add', ['product_id' => $this->product->id, 'quantity' => 4])->assertSessionHasErrors('quantity');
        $this->assertDatabaseHas('cart_items', ['quantity' => 5]);
    }

    public function test_invalid_cart_quantities_and_archived_products_are_rejected(): void
    {
        $this->actingAs($this->customer);
        foreach ([0, -1, 100, 1.5] as $quantity) {
            $this->post('/cart/add', ['product_id' => $this->product->id, 'quantity' => $quantity])->assertSessionHasErrors('quantity');
        }
        $this->product->update(['is_active' => false]);
        $this->post('/cart/add', ['product_id' => $this->product->id, 'quantity' => 1])->assertSessionHasErrors('quantity');
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_cart_quantity_response_recalculates_totals_and_remove_clears_cart(): void
    {
        $item = $this->cart();
        $this->actingAs($this->customer)->withSession(['selected_cart_items' => [$item->id]])->patchJson('/cart/'.$item->id, ['quantity' => 3])->assertOk()->assertJsonPath('subtotal', 3601.5)->assertJsonPath('total', 3651.5)->assertJsonPath('cartCount', 3);
        $this->delete('/cart/'.$item->id)->assertSessionHas('success');
        $this->get('/cart')->assertInertia(fn (Assert $page) => $page->where('total', 0)->has('cartItems', 0));
    }

    public function test_deselecting_all_items_persists_across_refresh_with_zero_shipping(): void
    {
        $this->cart();
        $this->actingAs($this->customer)->get('/cart')->assertOk();
        $this->postJson('/cart/update-selection', ['selected_items' => []])->assertOk()->assertJsonPath('total', 0)->assertJsonPath('shippingFee', 0);
        $this->get('/cart')->assertInertia(fn (Assert $page) => $page->has('selectedItems', 0)->where('total', 0));
        $this->get('/checkout')->assertRedirect('/cart');
    }

    public function test_cart_mutations_cannot_access_another_customers_items(): void
    {
        $item = $this->cart();
        $other = User::factory()->create();
        $other->cart()->create();
        $this->actingAs($other)->patchJson('/cart/'.$item->id, ['quantity' => 1])->assertNotFound();
        $this->delete('/cart/'.$item->id)->assertNotFound();
        $this->postJson('/cart/update-selection', ['selected_items' => [$item->id]])->assertUnprocessable();
        $this->assertDatabaseHas('cart_items', ['id' => $item->id, 'quantity' => 2]);
    }

    public function test_checkout_creates_one_consistent_order_and_retries_return_the_same_order(): void
    {
        $item = $this->cart();
        $payload = $this->checkout($item);
        $response = $this->post('/checkout', $payload);
        $order = Order::firstOrFail();
        $response->assertRedirect(route('order.confirmation', $order));
        $this->assertSame('2451.00', $order->total);
        $this->assertSame('50.00', $order->shipping_fee);
        $this->assertSame('Pending', $order->status);
        $this->assertStringContainsString('09171234567', $order->shipping_address);
        $this->assertSame('Carbon Spinning Rod', $order->items->first()->product_name);
        $this->assertSame(6, $this->product->fresh()->stock);
        $this->assertDatabaseCount('cart_items', 0);
        $this->post('/checkout', $payload)->assertRedirect(route('order.confirmation', $order));
        $this->assertDatabaseCount('orders', 1);
        $this->assertSame(6, $this->product->fresh()->stock);
    }

    public function test_checkout_preserves_unselected_items(): void
    {
        $item = $this->cart();
        $second = Product::create(['name' => 'Surf Rod', 'price' => 1800, 'stock' => 3, 'category_id' => $this->rods->id]);
        $remaining = $item->cart->items()->create(['product_id' => $second->id, 'quantity' => 1, 'price_snapshot' => $second->price]);
        $this->post('/checkout', $this->checkout($item))->assertSessionHasNoErrors();
        $this->assertDatabaseHas('cart_items', ['id' => $remaining->id]);
        $this->assertSame(3, $second->fresh()->stock);
    }

    public function test_checkout_validates_shipping_information_and_payment(): void
    {
        $item = $this->cart();
        $payload = $this->checkout($item);
        $payload['phone'] = '123';
        $payload['postal_code'] = 'zip';
        $payload['payment_method'] = 'Card';
        $payload['recipient'] = '';
        $this->post('/checkout', $payload)->assertSessionHasErrors(['phone', 'postal_code', 'payment_method', 'recipient']);
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_changed_stock_and_archival_do_not_create_partial_orders(): void
    {
        $item = $this->cart();
        $payload = $this->checkout($item);
        $this->product->update(['stock' => 1]);
        $this->post('/checkout', $payload)->assertSessionHasErrors('cart');
        $this->product->update(['stock' => 8, 'is_active' => false]);
        $this->post('/checkout', $payload)->assertSessionHasErrors('cart');
        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseCount('order_items', 0);
        $this->assertDatabaseCount('cart_items', 1);
    }

    public function test_price_or_shipping_changes_require_the_customer_to_review_a_new_quote(): void
    {
        $item = $this->cart();
        $payload = $this->checkout($item);
        Setting::set('shipping.base_fee', 100);
        $this->post('/checkout', $payload)->assertSessionHasErrors('cart');
        Setting::set('shipping.base_fee', 50);
        $this->product->update(['price' => 1300]);
        $this->post('/checkout', $payload)->assertSessionHasErrors('cart');
        $this->assertDatabaseCount('orders', 0);
        $this->get('/cart')->assertInertia(fn (Assert $page) => $page->where('pricesChanged', true)->where('subtotal', 2600));
    }

    public function test_cart_changes_invalidate_outstanding_checkout_quotes(): void
    {
        $item = $this->cart();
        $payload = $this->checkout($item);
        $this->patchJson('/cart/'.$item->id, ['quantity' => 1])->assertOk();
        $this->post('/checkout', $payload)->assertSessionHasErrors('checkout_token');
        $this->assertDatabaseCount('orders', 0);
    }

    public function test_checkout_uses_configured_shipping_and_zero_threshold_disables_promotion(): void
    {
        $item = $this->cart();
        Setting::set('shipping.free_threshold', 2000);
        $this->actingAs($this->customer)->withSession(['selected_cart_items' => [$item->id]])->get('/cart')->assertInertia(fn (Assert $page) => $page->where('shippingFee', 0));
        Setting::set('shipping.free_threshold', 0);
        Setting::set('shipping.base_fee', '85.25');
        $this->get('/cart')->assertInertia(fn (Assert $page) => $page->where('shippingFee', 85.25)->where('total', 2486.25));
    }

    public function test_checkout_and_admin_routes_require_authentication_and_authorization(): void
    {
        $this->get('/checkout')->assertRedirect('/login');
        $this->post('/checkout', [])->assertRedirect('/login');
        $this->actingAs($this->customer)->get('/admin/dashboard')->assertForbidden();
        $this->post('/admin/products', [])->assertForbidden();
    }

    public function test_order_ownership_and_historical_shipping_are_preserved(): void
    {
        $order = $this->order();
        Setting::set('shipping.base_fee', 999);
        $this->actingAs($this->customer)->get('/my-orders/'.$order->id)->assertInertia(fn (Assert $page) => $page->where('order.shipping_fee', '50.00'));
        $this->get('/my-orders')->assertInertia(fn (Assert $page) => $page->where('orders.data.0.shipping_fee', '50.00'));
        $this->actingAs(User::factory()->create())->get('/my-orders/'.$order->id)->assertForbidden();
        $this->get('/order-confirmation/'.$order->id)->assertForbidden();
    }

    public function test_product_archival_preserves_stock_and_history_and_can_be_restored(): void
    {
        $order = $this->order();
        $this->actingAs($this->admin)->delete('/admin/products/'.$this->product->id)->assertSessionHas('success');
        $this->assertSame(8, $this->product->fresh()->stock);
        $this->assertFalse($this->product->fresh()->is_active);
        $this->assertDatabaseCount('order_items', 1);
        $this->get('/shop')->assertInertia(fn (Assert $page) => $page->where('products.total', 0));
        $this->post('/admin/products/'.$this->product->id.'/toggle-availability')->assertSessionHas('success');
        $this->product->update(['name' => 'Updated name']);
        $this->assertSame('Carbon Spinning Rod', $order->items()->first()->product_name);
        $this->assertTrue($this->product->fresh()->is_active);
    }

    public function test_admin_product_validation_specs_and_stock_changes_reach_the_storefront(): void
    {
        $this->actingAs($this->admin)->post('/admin/products', ['name' => 'Test', 'price' => -1, 'stock' => -1, 'category_id' => 999, 'image' => 'javascript:alert(1)'])->assertSessionHasErrors(['price', 'stock', 'category_id', 'image']);
        $payload = ['name' => 'Carbon Spinning Rod', 'price' => '1399.25', 'stock' => 3, 'category_id' => $this->rods->id, 'specifications' => ['Length' => '7 ft', 'Power' => 'Medium']];
        $this->put('/admin/products/'.$this->product->id, $payload)->assertSessionHas('success');
        $this->get('/product/'.$this->product->slug)->assertInertia(fn (Assert $page) => $page->where('product.price', '1399.25')->where('product.stock', 3)->where('product.specifications.Length', '7 ft'));
    }

    public function test_fixed_categories_cannot_be_expanded_or_deleted(): void
    {
        $this->actingAs($this->admin)->post('/admin/categories', ['name' => 'Lures'])->assertSessionHasErrors('name');
        $this->delete('/admin/categories/'.$this->rods->id)->assertSessionHasErrors('category');
        $this->assertDatabaseCount('categories', 3);
    }

    public function test_bank_transfer_statuses_must_progress_in_order(): void
    {
        $order = $this->order('Pending', 'BankTransfer');
        $this->actingAs($this->admin)->patch('/admin/orders/'.$order->id.'/status', ['status' => 'Shipped'])->assertSessionHasErrors('status');
        foreach (['Paid', 'Shipped', 'Completed'] as $status) {
            $this->patch('/admin/orders/'.$order->id.'/status', ['status' => $status])->assertSessionHas('success');
        }
        $this->patch('/admin/orders/'.$order->id.'/status', ['status' => 'Pending'])->assertSessionHasErrors('status');
        $this->assertSame('Completed', $order->fresh()->status);
    }

    public function test_cod_can_ship_before_payment_and_bulk_status_updates_are_atomic(): void
    {
        $first = $this->order();
        $second = $this->order('Completed');
        $this->actingAs($this->admin)->post('/admin/orders/bulk-update-status', ['ids' => [$first->id, $second->id], 'status' => 'Shipped'])->assertSessionHasErrors('status');
        $this->assertSame('Pending', $first->fresh()->status);
        $this->patch('/admin/orders/'.$first->id.'/status', ['status' => 'Shipped'])->assertSessionHas('success');
        $this->actingAs($this->customer)->get('/my-orders/'.$first->id)->assertInertia(fn (Assert $page) => $page->where('order.status', 'Shipped'));
    }

    public function test_admin_dashboard_counts_actual_records_and_completed_quantities(): void
    {
        $order = $this->order('Completed');
        $order->items()->first()->update(['quantity' => 4]);
        $this->order('Pending');
        $this->product->update(['stock' => 0]);
        $this->actingAs($this->admin)->get('/admin/dashboard')->assertOk()->assertInertia(fn (Assert $page) => $page->where('stats.totalSales', 1250.5)->where('stats.totalOrders', 2)->where('stats.totalCustomers', 1)->where('stats.lowStockCount', 1)->where('topProducts.0.order_items_count', 4)->has('monthlySales', 6));
    }

    public function test_monthly_sales_do_not_merge_years_and_empty_months_are_zero(): void
    {
        $a = $this->order('Completed');
        $a->forceFill(['created_at' => '2025-01-10 12:00:00'])->save();
        $b = $this->order('Completed');
        $b->forceFill(['created_at' => '2026-01-10 12:00:00', 'total' => 2000])->save();
        $series = SalesSeries::monthly('2025-01-01', '2026-01-31 23:59:59');
        $this->assertCount(13, $series);
        $this->assertSame(1250.5, $series[0]['total']);
        $this->assertSame(0.0, $series[1]['total']);
        $this->assertSame(2000.0, $series[12]['total']);
    }

    public function test_analytics_and_exports_work_on_sqlite_with_completed_order_average(): void
    {
        $this->order('Completed');
        $this->order('Pending');
        $this->actingAs($this->admin)->get('/admin/analytics')->assertInertia(fn (Assert $page) => $page->where('stats.averageOrderValue', 1250.5)->where('stats.oneTimeCustomers', 1));
        $this->get('/admin/products/export/csv')->assertOk()->assertDownload('products.csv');
        $this->get('/admin/orders/export')->assertOk()->assertDownload('orders.csv');
        $this->get('/admin/analytics/export-csv')->assertOk();
        $this->get('/admin/analytics/export-pdf')->assertOk()->assertHeader('content-type', 'application/pdf');
    }

    public function test_email_actions_do_not_claim_delivery_when_no_mailer_is_configured(): void
    {
        $order = $this->order();
        config(['mail.default' => 'array']);
        $this->actingAs($this->admin)->post('/admin/orders/'.$order->id.'/send-email')->assertSessionHasErrors('email');
    }

    public function test_bulk_user_management_preserves_admin_access_and_order_history(): void
    {
        $order = $this->order();
        $this->actingAs($this->admin)->post('/admin/users/bulk-role', ['ids' => [$this->admin->id], 'role' => 'customer'])->assertSessionHasErrors('role');
        $this->post('/admin/users/bulk-delete', ['ids' => [$this->customer->id]])->assertSessionHasErrors('user');
        $this->assertDatabaseHas('orders', ['id' => $order->id]);
        $newUser = User::factory()->create(['role' => 'customer']);
        $this->post('/admin/users/bulk-role', ['ids' => [$newUser->id], 'role' => 'admin'])->assertSessionHas('success');
        $this->assertSame('admin', $newUser->fresh()->role);
    }

    public function test_legacy_purchase_names_are_preserved_before_admin_renames_a_product(): void
    {
        $order = $this->order();
        $order->items()->update(['product_name' => null]);
        $this->actingAs($this->admin)->put('/admin/products/'.$this->product->id, ['name' => 'Renamed Rod', 'price' => 1200.50, 'stock' => 8, 'category_id' => $this->rods->id])->assertSessionHas('success');
        $this->assertSame('Carbon Spinning Rod', $order->items()->first()->product_name);
    }

    public function test_order_filters_and_csv_export_accept_the_displayed_reference(): void
    {
        $order = $this->order();
        $other = $this->order('Completed');
        $this->actingAs($this->admin)->get('/admin/orders?search='.$order->reference)->assertInertia(fn (Assert $page) => $page->where('orders.total', 1)->where('orders.data.0.id', $order->id));
        $response = $this->get('/admin/orders/export?search='.$order->reference);
        $response->assertOk();
        $this->assertStringContainsString($order->reference, $response->streamedContent());
        $this->assertStringNotContainsString($other->reference, $response->streamedContent());
    }

    public function test_bulk_inventory_rejects_fractional_stock_and_admin_sort_columns_are_allowlisted(): void
    {
        $this->actingAs($this->admin)->post('/admin/products/bulk-update-stock', ['products' => [['id' => $this->product->id, 'stock' => 2.5]]])->assertSessionHasErrors('products.0.stock');
        $this->assertSame(8, $this->product->fresh()->stock);
        $this->get('/admin/products?sort=anything')->assertSessionHasErrors('sort');
        $this->get('/admin/products?sort=&direction=')->assertOk();
    }

    public function test_formatted_local_mobile_numbers_are_normalized(): void
    {
        $item = $this->cart();
        $payload = $this->checkout($item);
        $payload['phone'] = '0917 123 4567';
        $this->post('/checkout', $payload)->assertSessionHasNoErrors();
        $this->assertStringContainsString('09171234567', Order::firstOrFail()->shipping_address);
    }

    public function test_oversized_orders_fail_before_inventory_is_reserved(): void
    {
        $this->product->update(['price' => 999999.99, 'stock' => 99]);
        $item = $this->cart(99);
        $second = Product::create(['name' => 'Premium Rod', 'price' => 999999.99, 'stock' => 99, 'category_id' => $this->rods->id]);
        $secondItem = $item->cart->items()->create(['product_id' => $second->id, 'quantity' => 99, 'price_snapshot' => $second->price]);
        $payload = $this->checkout($item);
        $quote = session('checkout_quotes.'.$payload['checkout_token']);
        $quote['item_ids'][] = $secondItem->id;
        $quote['total'] = 197999998.02;
        $this->withSession(['checkout_quotes' => [$payload['checkout_token'] => $quote]])->post('/checkout', $payload)->assertSessionHasErrors('cart');
        $this->assertDatabaseCount('orders', 0);
        $this->assertSame(99, $this->product->fresh()->stock);
        $this->assertSame(99, $second->fresh()->stock);
    }
}
