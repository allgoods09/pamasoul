import { ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function EmptyState({ title, message, buttonText, buttonLink, onButtonClick }) {
    const handleClick = () => {
        if (onButtonClick) {
            onButtonClick();
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingBagIcon className="h-8 w-8 text-gray-400" />
                </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-500 mb-6">{message}</p>
            {buttonText && (buttonLink || onButtonClick) && (
                onButtonClick ? (
                    <button
                        onClick={handleClick}
                        className="inline-flex px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {buttonText}
                    </button>
                ) : (
                    <Link
                        href={buttonLink}
                        className="inline-flex px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {buttonText}
                    </Link>
                )
            )}
        </div>
    );
}