import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useStore } from '../store/index';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Logout from '../views/Logout.vue';
import Profile from '../views/Profile.vue';
import Chat from '../views/Chat.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
  },
  {
    path: '/profile/:requestUserId?',
    name: 'Profile',
    props: true,
    component: Profile,
  },
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, _, next) => {
  const store = useStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getUser) {
      // Redirect to the Login Page
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
