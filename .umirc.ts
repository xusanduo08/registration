import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  fastRefresh: {},
  proxy: {
    '/upload': {
      target: 'https://www.niupic.com/api/upload',
      changeOrigin: true,
      pathRewrite: {'^/upload': ''},
    }
  }
});
