export const getProductImageUrl = (product, size = 'medium') => {
    // If product has custom image, use it
    if (product?.image && product.image !== '' && product.image !== null) {
        return product.image;
    }
    
    // Different sizes for different places (kept for consistency)
    const sizes = {
        thumbnail: '100/100',
        small: '200/200',
        medium: '400/300',
        large: '800/600',
    };
    
    // Use your app logo as fallback
    // Just change this ONE line!
    return '/images/logo.png';
};