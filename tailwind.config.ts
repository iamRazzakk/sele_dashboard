/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primaryColor: '#007BFF',
                iconColor: '#333333',
                customGray: '#757575',
                icon: '#3395FF',
                // primaryText: '#1F1F1F',

                // 
                // stoke: '#00369A',
            },
            backgroundColor: {
                bgBlue: '#D6EAFF', // Custom background color mapping
                primaryBg: '#3395FF',
                primary: ' #007BFF',
            },
            fontFamily: {
                montserrat: ['Montserrat', 'sans-serif'],
                outfit: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
