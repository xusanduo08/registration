import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/Login' },
    { path: '/regist', component: '@/pages/Registration' },
    { path: '/login', component: '@/pages/Login' },
  ],
  fastRefresh: {},
  proxy: {
    '/upload': {
      target: 'https://www.niupic.com/api/upload',
      changeOrigin: true,
      pathRewrite: { '^/upload': '' },
    },
  },
});
