import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // host: '69.62.67.125',
    },
    // preview: {
    //     host: '69.62.67.125',
    //     allowedHosts: ['admin.selerental.com'],
    // },
});
