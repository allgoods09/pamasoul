<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Product extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'name', 'slug', 'description', 'image', 'price', 'stock', 'category_id', 'is_active', 'specifications',
    ];

    protected $attributes = ['is_active' => true];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_active' => 'boolean',
        'specifications' => 'array',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function cartItems(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    protected $appends = ['image_url', 'stock_status'];

    public function getImageUrlAttribute(): string
    {
        if ($this->image && (preg_match('~^https?://~i', $this->image) || str_starts_with($this->image, '/images/'))) {
            return $this->image;
        }

        return '/images/product-placeholder.svg';
    }

    // Other accessors
    public function getFormattedPriceAttribute(): string
    {
        return '₱'.number_format($this->price, 2);
    }

    public function getStockStatusAttribute(): string
    {
        if (! $this->is_active) {
            return 'Unavailable';
        }
        if ($this->stock <= 0) {
            return 'Out of Stock';
        }
        if ($this->stock <= 5) {
            return 'Low Stock';
        }

        return 'In Stock';
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->stock <= 5;
    }

    // Mutators
    public function setNameAttribute($value)
    {
        $this->attributes['name'] = trim($value);
    }

    // Scopes
    public function scopeInStock($query)
    {
        return $query->where('stock', '>', 0);
    }

    public function scopeLowStock($query)
    {
        return $query->where('stock', '<=', 5)->where('stock', '>', 0);
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('stock', '<=', 0);
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where(fn ($q) => $q->where('name', 'LIKE', "%{$term}%")->orWhere('description', 'LIKE', "%{$term}%"));
    }

    public function scopePriceRange($query, $min, $max)
    {
        return $query->whereBetween('price', [$min, $max]);
    }

    // Helper methods
    public function decreaseStock(int $quantity): bool
    {
        if ($this->stock >= $quantity) {
            $this->decrement('stock', $quantity);

            return true;
        }

        return false;
    }

    public function increaseStock(int $quantity): void
    {
        $this->increment('stock', $quantity);
    }
}
