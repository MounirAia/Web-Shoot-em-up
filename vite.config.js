import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
            },
            output: {
                // Set assetFileNames and chunkFileNames to place all assets at the root level
                assetFileNames: '[name].[ext]',
                chunkFileNames: '[name].js',
                entryFileNames: '[name].js',
            },
        },
    },
});
