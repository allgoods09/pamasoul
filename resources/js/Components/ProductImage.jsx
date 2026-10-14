import { getProductImageUrl, handleImageError } from "@/helpers/imageHelper";
export default function ProductImage({
    product,
    className = "",
    loading = "lazy",
    ...props
}) {
    return (
        <img
            src={getProductImageUrl(product)}
            alt={product?.name || "Fishing tackle"}
            onError={handleImageError}
            loading={loading}
            decoding="async"
            className={className}
            {...props}
        />
    );
}
