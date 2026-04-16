import { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ToastNotification({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
        error: <XCircleIcon className="h-5 w-5 text-red-500" />,
    };

    const backgrounds = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border ${backgrounds[type]}`}>
                {icons[type]}
                <p className="text-sm text-gray-700">{message}</p>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}