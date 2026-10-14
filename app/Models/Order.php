<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',
        'total',
        'shipping_fee',
        'payment_method',
        'shipping_address',
        'checkout_token',
    ];

    protected $casts = [
        'total' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    // Accessors
    public function getStatusBadgeAttribute(): string
    {
        $badges = [
            'Pending' => 'bg-yellow-100 text-yellow-800',
            'Paid' => 'bg-blue-100 text-blue-800',
            'Shipped' => 'bg-purple-100 text-purple-800',
            'Completed' => 'bg-green-100 text-green-800',
        ];

        return $badges[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    public function getFormattedTotalAttribute(): string
    {
        return '₱'.number_format($this->total, 2);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'Pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'Completed');
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    protected $appends = ['reference', 'allowed_statuses'];

    public function getReferenceAttribute(): string
    {
        return 'PS-'.($this->created_at?->format('Y') ?? '0000').'-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }

    public function getAllowedStatusesAttribute(): array
    {
        return match ($this->status) {
            'Pending' => $this->payment_method === 'COD' ? ['Paid', 'Shipped'] : ['Paid'],
            'Paid' => ['Shipped'],
            'Shipped' => ['Completed'],
            default => [],
        };
    }

    public function updateStatus(string $status): bool
    {
        return in_array($status, $this->allowed_statuses, true) && $this->update(['status' => $status]);
    }
}
