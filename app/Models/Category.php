<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
    ];

    // Relationships
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // Scopes for filtering
    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'LIKE', "%{$term}%");
    }

    // Accessors
    public function getProductCountAttribute(): int
    {
        return $this->products()->count();
    }

    // Future-ready: For soft deletes (uncomment when needed)
    // use SoftDeletes;
    // protected $dates = ['deleted_at'];
}