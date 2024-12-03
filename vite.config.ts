// Plugins
import Vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
// import ViteFonts from 'unplugin-fonts/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'

// Utilities
import { defineConfig, loadEnv } from "vite";
import { fileURLToPath, URL } from "node:url";

import autoprefixer from "autoprefixer";
import tailwind from "tailwindcss";

import RadixVueResolver from 'radix-vue/resolver'

export default ({ mode }: { mode: any }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return defineConfig({
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        }
      },
    },
    plugins: [
      Vue(),
      VueRouter(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"],
        },
        manifest: {
          short_name: "Encadrement",
          name: "Encadrement - Sélection",
          theme_color: "#fdcd56",
          background_color: "#fdcd56",
          scope: "./",
          start_url: "./",
          orientation: "portrait",
          display: "standalone",
        },
      }),
      Components({
        dts: true,
        resolvers: [
          RadixVueResolver()
        ]
      }),
    ],
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
    },
    server: {
      host: true,
    },
  });
};
