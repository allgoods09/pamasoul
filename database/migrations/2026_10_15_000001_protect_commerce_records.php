<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->index();
            $table->json('specifications')->nullable();
        });
        Schema::table('orders', fn (Blueprint $table) => $table->uuid('checkout_token')->nullable()->unique());
        Schema::table('order_items', fn (Blueprint $table) => $table->string('product_name', 150)->nullable());
    }

    public function down(): void
    {
        Schema::table('order_items', fn (Blueprint $table) => $table->dropColumn('product_name'));
        Schema::table('orders', function (Blueprint $table) {
            $table->dropUnique(['checkout_token']);
            $table->dropColumn('checkout_token');
        });
        Schema::table('products', fn (Blueprint $table) => $table->dropColumn(['is_active', 'specifications']));
    }
};
