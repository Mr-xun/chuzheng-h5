import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    redirect: '/recruit-detail',
  },
  {
    path: '/recruit-detail',
    name: 'RecruitDetail',
    component: () => import(/* webpackChunkName: "Detail" */ '../views/recruitDetail/Index.vue'),
    meta:{
      title:'急招专业分工'
    }
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
      document.title = to.meta.title;
  }
  next();
})
export default router
