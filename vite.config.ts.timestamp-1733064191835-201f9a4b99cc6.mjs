// vite.config.ts
import Vue from "file:///Users/adominique/Perso/encadrement-shop/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { VitePWA } from "file:///Users/adominique/Perso/encadrement-shop/node_modules/vite-plugin-pwa/dist/index.js";
import Components from "file:///Users/adominique/Perso/encadrement-shop/node_modules/unplugin-vue-components/dist/vite.js";
import VueRouter from "file:///Users/adominique/Perso/encadrement-shop/node_modules/unplugin-vue-router/dist/vite.js";
import { defineConfig, loadEnv } from "file:///Users/adominique/Perso/encadrement-shop/node_modules/vite/dist/node/index.js";
import { fileURLToPath, URL } from "node:url";
import autoprefixer from "file:///Users/adominique/Perso/encadrement-shop/node_modules/autoprefixer/lib/autoprefixer.js";
import tailwind from "file:///Users/adominique/Perso/encadrement-shop/node_modules/tailwindcss/lib/index.js";
import RadixVueResolver from "file:///Users/adominique/Perso/encadrement-shop/node_modules/radix-vue/dist/resolver/index.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/adominique/Perso/encadrement-shop/vite.config.ts";
var vite_config_default = ({ mode }) => {
  process.env = Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return defineConfig({
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()]
      },
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
        }
      }
    },
    plugins: [
      Vue(),
      VueRouter(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        workbox: {
          cleanupOutdatedCaches: true,
          globPatterns: ["**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}"]
        },
        manifest: {
          short_name: "Encadrement",
          name: "Encadrement - S\xE9lection",
          theme_color: "#fdcd56",
          background_color: "#fdcd56",
          scope: "./",
          start_url: "./",
          orientation: "portrait",
          display: "standalone"
        }
      }),
      Components({
        dts: true,
        resolvers: [
          RadixVueResolver()
        ]
      })
    ],
    define: { "process.env": {} },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"]
    },
    server: {
      host: true
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYWRvbWluaXF1ZS9QZXJzby9lbmNhZHJlbWVudC1zaG9wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWRvbWluaXF1ZS9QZXJzby9lbmNhZHJlbWVudC1zaG9wL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hZG9taW5pcXVlL1BlcnNvL2VuY2FkcmVtZW50LXNob3Avdml0ZS5jb25maWcudHNcIjsvLyBQbHVnaW5zXG5pbXBvcnQgVnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tIFwidml0ZS1wbHVnaW4tcHdhXCI7XG4vLyBpbXBvcnQgVml0ZUZvbnRzIGZyb20gJ3VucGx1Z2luLWZvbnRzL3ZpdGUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IFZ1ZVJvdXRlciBmcm9tICd1bnBsdWdpbi12dWUtcm91dGVyL3ZpdGUnXG5cbi8vIFV0aWxpdGllc1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gXCJub2RlOnVybFwiO1xuXG5pbXBvcnQgYXV0b3ByZWZpeGVyIGZyb20gXCJhdXRvcHJlZml4ZXJcIjtcbmltcG9ydCB0YWlsd2luZCBmcm9tIFwidGFpbHdpbmRjc3NcIjtcblxuaW1wb3J0IFJhZGl4VnVlUmVzb2x2ZXIgZnJvbSAncmFkaXgtdnVlL3Jlc29sdmVyJ1xuXG5leHBvcnQgZGVmYXVsdCAoeyBtb2RlIH06IHsgbW9kZTogYW55IH0pID0+IHtcbiAgcHJvY2Vzcy5lbnYgPSBPYmplY3QuYXNzaWduKHByb2Nlc3MuZW52LCBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCksIFwiXCIpKTtcblxuICByZXR1cm4gZGVmaW5lQ29uZmlnKHtcbiAgICBjc3M6IHtcbiAgICAgIHBvc3Rjc3M6IHtcbiAgICAgICAgcGx1Z2luczogW3RhaWx3aW5kKCksIGF1dG9wcmVmaXhlcigpXSxcbiAgICAgIH0sXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICAgIHNjc3M6IHtcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInLFxuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0sXG4gICAgcGx1Z2luczogW1xuICAgICAgVnVlKCksXG4gICAgICBWdWVSb3V0ZXIoKSxcbiAgICAgIFZpdGVQV0Eoe1xuICAgICAgICByZWdpc3RlclR5cGU6IFwiYXV0b1VwZGF0ZVwiLFxuICAgICAgICBpbmplY3RSZWdpc3RlcjogXCJhdXRvXCIsXG4gICAgICAgIHdvcmtib3g6IHtcbiAgICAgICAgICBjbGVhbnVwT3V0ZGF0ZWRDYWNoZXM6IHRydWUsXG4gICAgICAgICAgZ2xvYlBhdHRlcm5zOiBbXCIqKi8qLntqcyxjc3MsaHRtbCxpY28scG5nLHN2Zyxqc29uLHZ1ZSx0eHQsd29mZjJ9XCJdLFxuICAgICAgICB9LFxuICAgICAgICBtYW5pZmVzdDoge1xuICAgICAgICAgIHNob3J0X25hbWU6IFwiRW5jYWRyZW1lbnRcIixcbiAgICAgICAgICBuYW1lOiBcIkVuY2FkcmVtZW50IC0gU1x1MDBFOWxlY3Rpb25cIixcbiAgICAgICAgICB0aGVtZV9jb2xvcjogXCIjZmRjZDU2XCIsXG4gICAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogXCIjZmRjZDU2XCIsXG4gICAgICAgICAgc2NvcGU6IFwiLi9cIixcbiAgICAgICAgICBzdGFydF91cmw6IFwiLi9cIixcbiAgICAgICAgICBvcmllbnRhdGlvbjogXCJwb3J0cmFpdFwiLFxuICAgICAgICAgIGRpc3BsYXk6IFwic3RhbmRhbG9uZVwiLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBDb21wb25lbnRzKHtcbiAgICAgICAgZHRzOiB0cnVlLFxuICAgICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgICBSYWRpeFZ1ZVJlc29sdmVyKClcbiAgICAgICAgXVxuICAgICAgfSksXG4gICAgXSxcbiAgICBkZWZpbmU6IHsgXCJwcm9jZXNzLmVudlwiOiB7fSB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoXCIuL3NyY1wiLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgIH0sXG4gICAgICBleHRlbnNpb25zOiBbXCIuanNcIiwgXCIuanNvblwiLCBcIi5qc3hcIiwgXCIubWpzXCIsIFwiLnRzXCIsIFwiLnRzeFwiLCBcIi52dWVcIl0sXG4gICAgfSxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgfSxcbiAgfSk7XG59O1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLE9BQU8sU0FBUztBQUNoQixTQUFTLGVBQWU7QUFFeEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxlQUFlO0FBR3RCLFNBQVMsY0FBYyxlQUFlO0FBQ3RDLFNBQVMsZUFBZSxXQUFXO0FBRW5DLE9BQU8sa0JBQWtCO0FBQ3pCLE9BQU8sY0FBYztBQUVyQixPQUFPLHNCQUFzQjtBQWQySixJQUFNLDJDQUEyQztBQWdCek8sSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFxQjtBQUMxQyxVQUFRLE1BQU0sT0FBTyxPQUFPLFFBQVEsS0FBSyxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRXpFLFNBQU8sYUFBYTtBQUFBLElBQ2xCLEtBQUs7QUFBQSxNQUNILFNBQVM7QUFBQSxRQUNQLFNBQVMsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO0FBQUEsTUFDdEM7QUFBQSxNQUNBLHFCQUFxQjtBQUFBLFFBQ25CLE1BQU07QUFBQSxVQUNKLEtBQUs7QUFBQSxRQUNQO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLFVBQVU7QUFBQSxNQUNWLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQSxRQUNkLGdCQUFnQjtBQUFBLFFBQ2hCLFNBQVM7QUFBQSxVQUNQLHVCQUF1QjtBQUFBLFVBQ3ZCLGNBQWMsQ0FBQyxtREFBbUQ7QUFBQSxRQUNwRTtBQUFBLFFBQ0EsVUFBVTtBQUFBLFVBQ1IsWUFBWTtBQUFBLFVBQ1osTUFBTTtBQUFBLFVBQ04sYUFBYTtBQUFBLFVBQ2Isa0JBQWtCO0FBQUEsVUFDbEIsT0FBTztBQUFBLFVBQ1AsV0FBVztBQUFBLFVBQ1gsYUFBYTtBQUFBLFVBQ2IsU0FBUztBQUFBLFFBQ1g7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULEtBQUs7QUFBQSxRQUNMLFdBQVc7QUFBQSxVQUNULGlCQUFpQjtBQUFBLFFBQ25CO0FBQUEsTUFDRixDQUFDO0FBQUEsSUFDSDtBQUFBLElBQ0EsUUFBUSxFQUFFLGVBQWUsQ0FBQyxFQUFFO0FBQUEsSUFDNUIsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxNQUN0RDtBQUFBLE1BQ0EsWUFBWSxDQUFDLE9BQU8sU0FBUyxRQUFRLFFBQVEsT0FBTyxRQUFRLE1BQU07QUFBQSxJQUNwRTtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
