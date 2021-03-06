"use strict";

// see http://vuejs-templates.github.io/webpack for documentation.
const path = require("path");
const configs = require("./merakiConfigs");

module.exports = {
  build: {
    env: require("./prod.env"),
    index: path.resolve(__dirname, "../dist/index.html"),
    assetsRoot: path.resolve(__dirname, "../dist"),
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ["js", "css"],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require("./dev.env"),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: "static",
    assetsPublicPath: "/",
    /* 
    before: function(app) {
      app.use(body_parser.json());

      app.all('/api/**', function(req,res) {
        console.log('meraki API request handler ',configs.apiUrl + req.originalUrl)
        fetch_config = {
            method: req.method,
            headers: {
              'X-Cisco-Meraki-API-Key': req.headers['x-cisco-meraki-api-key'] || configs.apiKey, // Use client API key first, then server
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body),
            agent: new https.Agent({
                rejectUnauthorized: false
            })
          }

          fetch(configs.apiUrl + req.originalUrl,fetch_config).then((response) => {
              response.json().then((body) => {
                  res.status(response.status).json(body)
              })                    
          })
      });
    },
    */
    // works but not with redirects
    proxyTable: {
      "/api": {
        target: "http://localhost:8088/api",
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        },

        secure: false,
        headers: {
          //'X-Cisco-Meraki-API-Key': configs.apiKey, // server side
          "Content-Type": "application/json"
        }
      }
    },

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
