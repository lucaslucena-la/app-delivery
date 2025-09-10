import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Isso faz o Vite escutar em todos os endereços de rede,
    // tornando-o acessível de fora do contêiner Docker.
    host: true,
    port: 5173, // Garante que a porta é a 5173
    watch: {
      usePolling: true
    }
  }
})