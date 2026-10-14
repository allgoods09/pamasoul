import { useState } from "react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
export default function useCartAction() {
    const [adding, setAdding] = useState(false);
    const add = (product, quantity = 1, onAdded) => {
        if (adding || product.stock <= 0 || product.is_active === false) return;
        setAdding(true);
        router.post(
            "/cart/add",
            { product_id: product.id, quantity },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    if (page.props.flash?.success) onAdded?.();
                },
                onError: (errors) =>
                    toast.error(
                        errors.quantity ||
                            errors.product_id ||
                            "Could not add this item. Please try again.",
                    ),
                onFinish: () => setAdding(false),
            },
        );
    };
    return { adding, add };
}
