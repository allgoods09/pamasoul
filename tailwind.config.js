import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', 'system-ui', 'sans-serif'],
            },
            colors: {
                'pamasoul': {
                    50: '#F0E8FF',
                    100: '#E1D1FF',
                    200: '#C4A3FF',
                    300: '#B49AFF',
                    400: '#A580FF',
                    500: '#9A7BE5',
                    600: '#8A6BCC',
                    700: '#7A5BB3',
                    800: '#6A4B99',
                    900: '#5A3B80',
                    DEFAULT: '#B49AFF',
                },
            }
        },
    },

    plugins: [forms],
};
