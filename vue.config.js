module.exports = {
  pwa: {
    name: "Encadrement - Shop",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      exclude: [/\.map$/, /netlify.toml/],
      // ...other Workbox options...
    },
  },
};
