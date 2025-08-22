import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    port: 3000,
    open: true
  },
  build: {
    // 优化构建
    minify: 'esbuild',
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue'],
        },
      },
    },
    // 启用压缩
    cssCodeSplit: true,
    sourcemap: false,
  },
  // SEO优化：确保预渲染
  ssr: {
    noExternal: ['vue']
  }
})
