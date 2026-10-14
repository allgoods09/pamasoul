<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserManagement
{
    public static function apply(array $ids, ?string $role = null): void
    {
        DB::transaction(function () use ($ids, $role) {
            $locked = User::where('role', 'admin')->orWhereIn('id', $ids)->orderBy('id')->lockForUpdate()->get();
            $targets = $locked->whereIn('id', $ids);
            $field = $role ? 'role' : 'user';
            if ($targets->count() !== count($ids) || in_array(auth()->id(), $ids)) {
                throw ValidationException::withMessages([$field => 'You cannot modify your own admin account. Refresh if a user is no longer available.']);
            }
            $removedAdmins = ($role === 'admin') ? 0 : $targets->where('role', 'admin')->count();
            if ($locked->where('role', 'admin')->count() - $removedAdmins < 1) {
                throw ValidationException::withMessages([$field => 'At least one administrator must remain. No users were changed.']);
            }
            if (! $role && $targets->contains(fn ($user) => $user->orders()->exists())) {
                throw ValidationException::withMessages([$field => 'Customers with order history cannot be deleted. No users were changed.']);
            }
            foreach ($targets as $user) {
                if ($role) {
                    $user->update(['role' => $role]);
                } else {
                    $user->delete();
                }
            }
        }, 3);
    }
}
