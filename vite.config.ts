import { loadEnv, defineConfig } from 'vite';
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const PORT = 9000;

const env = loadEnv('all', process.cwd());

// https://vitejs.dev/config/
export default defineConfig({
  base: env.VITE_BASE_PATH,
  plugins: [react(), tailwindcss()],
  server: { port: PORT },
  preview: { port: PORT, host: true },
});
