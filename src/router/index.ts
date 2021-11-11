import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Cookies from 'js-cookie'

const mainRoutes = [{
  path: '/layout/userManage',
  name: 'userManage',
  component: () => import(/* webpackChunkName: "userManage" */ '../views/user-manage.vue'),
  routeName: '用户管理'
}, {
  path: '/layout/tableManage',
  name: 'tableManage',
  component: () => import(/* webpackChunkName: "tableManage" */ '../views/table-manage.vue'),
  routeName: '数据库管理'
},]

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import(/* webpackChunkName: "layout" */ '../views/layout.vue'),
    children: mainRoutes
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});


router.beforeEach((to, from, next) => {
  const token = Cookies.get('token');
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
export { mainRoutes };
export default router;
