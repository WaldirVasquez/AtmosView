import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/styles.css', 'resources/js/theme.js',
                    'resources/css/clima.css',
                    'resources/js/clima.js'
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
