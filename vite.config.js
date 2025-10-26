import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/styles.css', 'resources/js/theme.js',
                    'resources/css/clima.css',
                    'resources/js/clima.js',
                    'resources/css/radar.css',
                    'resources/js/radar.js'
                    
            ],
            refresh: true,
        }),
        tailwindcss(),
    ],
});
