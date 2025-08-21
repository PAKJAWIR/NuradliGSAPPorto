import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import compression from "vite-plugin-compression";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // GZIP
    compression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, // hanya file >10KB
      deleteOriginalAssets: false,
    }),
    // BROTLI
    compression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
      deleteOriginalAssets: false,
    }),
  ],
  build: {
    minify: isProd ? "terser" : "esbuild",
    terserOptions: {
      compress: {
        drop_console: true, // hapus console.log di prod
        drop_debugger: true, // hapus debugger
      },
    },
  },
});
