const { sessionMiddleware, unstable_simpleRolesIsAuthorized } = require("@blitzjs/server")
const withLess = require("@zeit/next-less");
const withCss = require('@zeit/next-css')

module.exports = withLess(withCss({
  lessLoaderOptions: {
    javascriptEnabled: true
  },
  middleware: [
    sessionMiddleware({
      unstable_isAuthorized: unstable_simpleRolesIsAuthorized,
    }),
  ],
  /* Uncomment this to customize the webpack config
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config
    return config
  },
  */
}))
