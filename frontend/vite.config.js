import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend chạy ở 5173, proxy /api sang backend 3000 để các service dùng
// đường dẫn tương đối. Khi build production thì đặt VITE_API_BASE_URL tương ứng.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },
});
