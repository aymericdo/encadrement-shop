module.exports = {
  pwa: {
    name: "Encadrement - Sélection",
    themeColor: "#fdcd56",
    msTileColor: "#050505",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    manifestOptions: {
      background_color: "#fdcd56",
    },

    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      exclude: [/\.map$/, /_redirects/],
      // ...other Workbox options...
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @import "~@/assets/scss/variables.scss";
          @import "~@/assets/scss/garnett.scss";
        `,
      },
    },
  },
};
