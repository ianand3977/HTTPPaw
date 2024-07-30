const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://http.dog',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '',
      },
    })
  );
};
