import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  optimizeDeps: {
    include: ['vue']
  },
  server: {
    host: '0.0.0.0',
    port: 3100,
    open: true
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'VueGanttLinetable',
      fileName: (format) => `vue-gantt-linetable.${format}.js`
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})