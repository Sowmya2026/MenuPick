// vite.config.js
import { defineConfig } from "file:///F:/MenuPick/meal-admin-panel/node_modules/vite/dist/node/index.js";
import react from "file:///F:/MenuPick/meal-admin-panel/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3001
  },
  define: {
    // Add this to handle React Router future flags
    global: "globalThis"
  },
  resolve: {
    // Add this for better module resolution
    alias: {
      "./runtimeConfig": "./runtimeConfig.browser"
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "firebase": ["firebase/app", "firebase/auth", "firebase/firestore"],
          "ui-vendor": ["framer-motion", "lucide-react", "react-hot-toast"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFxNZW51UGlja1xcXFxtZWFsLWFkbWluLXBhbmVsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFxNZW51UGlja1xcXFxtZWFsLWFkbWluLXBhbmVsXFxcXHZpdGUuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi9NZW51UGljay9tZWFsLWFkbWluLXBhbmVsL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAxLFxuICB9LFxuICBkZWZpbmU6IHtcbiAgICAvLyBBZGQgdGhpcyB0byBoYW5kbGUgUmVhY3QgUm91dGVyIGZ1dHVyZSBmbGFnc1xuICAgIGdsb2JhbDogJ2dsb2JhbFRoaXMnLFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgLy8gQWRkIHRoaXMgZm9yIGJldHRlciBtb2R1bGUgcmVzb2x1dGlvblxuICAgIGFsaWFzOiB7XG4gICAgICAnLi9ydW50aW1lQ29uZmlnJzogJy4vcnVudGltZUNvbmZpZy5icm93c2VyJyxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAncmVhY3QtdmVuZG9yJzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICdmaXJlYmFzZSc6IFsnZmlyZWJhc2UvYXBwJywgJ2ZpcmViYXNlL2F1dGgnLCAnZmlyZWJhc2UvZmlyZXN0b3JlJ10sXG4gICAgICAgICAgJ3VpLXZlbmRvcic6IFsnZnJhbWVyLW1vdGlvbicsICdsdWNpZGUtcmVhY3QnLCAncmVhY3QtaG90LXRvYXN0J10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxuICB9LFxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUE0USxTQUFTLG9CQUFvQjtBQUN6UyxPQUFPLFdBQVc7QUFFbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxRQUFRO0FBQUE7QUFBQSxJQUVOLFFBQVE7QUFBQSxFQUNWO0FBQUEsRUFDQSxTQUFTO0FBQUE7QUFBQSxJQUVQLE9BQU87QUFBQSxNQUNMLG1CQUFtQjtBQUFBLElBQ3JCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELFlBQVksQ0FBQyxnQkFBZ0IsaUJBQWlCLG9CQUFvQjtBQUFBLFVBQ2xFLGFBQWEsQ0FBQyxpQkFBaUIsZ0JBQWdCLGlCQUFpQjtBQUFBLFFBQ2xFO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLHVCQUF1QjtBQUFBLEVBQ3pCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
