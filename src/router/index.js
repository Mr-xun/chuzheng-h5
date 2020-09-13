import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    redirect: "/recruit-detail",
  },
  {
    path: '/recruit-detail',
    name: 'RecruitDetail',
    component: () => import(/* webpackChunkName: "Detail" */ '../views/recruitDetail/Index.vue'),
    meta:{
      title:'招工详情'
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
