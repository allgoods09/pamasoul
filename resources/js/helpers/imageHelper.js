export const getProductImageUrl = (product) => {
    const source = product?.image_url || product?.image;
    return typeof source === "string" &&
        (/^https?:\/\//i.test(source) || source.startsWith("/images/"))
        ? source
        : "/images/product-placeholder.svg";
};
export const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = "/images/product-placeholder.svg";
};
export const formatPeso = (value) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(Number(value) || 0);
