import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || '')
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
              'tensorflow-vendor': ['@tensorflow/tfjs', '@tensorflow-models/coco-ssd'],
              'gemini-vendor': ['@google/genai'],
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
