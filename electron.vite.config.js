
import { resolve } from 'path'
import { defineConfig } from 'electron-vite';
import react from '@vitejs/plugin-react'
import packageJson from "./package.json";
import path from 'path';

export default defineConfig({
    main: {
        plugins: [],
        define: {
            'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
            'import.meta.env.PACKAGE_DESCRIPTION': JSON.stringify(packageJson.description)
        },
        build: {
            sourcemap: false, // Désactive globalement en production si non nécessaire
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/main/index.js')
                }
            }
        }
    },
    preload: {
        plugins: [],
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/preload/index.js')
                }
            }
        }
    },
    renderer: {
        plugins: [react()],
        define: {
            'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
            'import.meta.env.PACKAGE_DESCRIPTION': JSON.stringify(packageJson.description)
        },
        resolve: {
            alias: {
                "components": path.resolve(__dirname, "src", "renderer", "src", "components"),
                "actions": path.resolve(__dirname, "src", "renderer", "src", "actions"),
                "utils": path.resolve(__dirname, "src", "renderer", "src", "utils"),
                "routes": path.resolve(__dirname, "src", "renderer", "src", "routes"),
            },
        },
        build: {
            rollupOptions: {
                input: {
                    index: resolve(__dirname, 'src/renderer/index.html')
                }
            }
        }
    },
    server: {
        sourcemapIgnoreList(sourcePath) {
            // Ignore les fichiers provenant de node_modules
            return sourcePath.includes('node_modules');
        }
    }
})