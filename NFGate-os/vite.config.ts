import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { web3: resolve(__dirname, './node_modules/web3/dist/web3.min.js') } },
  // server: {
  //   proxy: {
  //     "/login": {
  //       target: "http://nfgate.io/nfgate",
  //       changeOrigin: true,
  //      rewrite: (path) => path.replace(/^\/trust/, ""),
  //     },
  //     "/getUserNFTList": {
  //       target: "http://nfgate.io/nfgate/",
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/trust/, ""),
  //     },
  //   },
  // },

})
