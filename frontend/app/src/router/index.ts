import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { configService } from '@/services/configService';
import { useStore } from '../store/index';
import Home from '../views/Home.vue';
import Login from '../views/auth/Login.vue';
import Logout from '../views/auth/Logout.vue';
import FortyTwo from '../views/auth/FortyTwo.vue';
import Profile from '../views/Profile.vue';
import Chat from '../views/chat/index.vue';
import ChatCreate from '../views/chat/create.vue';
import ChatId from '../views/chat/_id.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/auth/42/callback',
    name: 'FortyTwoCallback',
    component: FortyTwo,
  },
  {
    path: '/auth/logout',
    name: 'Logout',
    component: Logout,
  },
  {
    path: '/profile/me',
    name: 'MyProfile',
    props: true,
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/profile/:requestUserId?',
    name: 'Profile',
    component: Profile,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat',
    name: 'Chat',
    component: Chat,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat/create',
    name: 'ChatCreate',
    component: ChatCreate,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat/:id',
    name: 'ChatId',
    component: ChatId,
    props: true,
    meta: {
      requiresAuth: true,
    },
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
  history: createWebHistory(configService.getBaseUrl()),
  routes,
});

router.beforeEach((to, _, next) => {
  if (to.matched.length <= 0) {
    next('/');
    return;
  }
  const store = useStore();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getUser) {
      // Redirect to the Login Page
      next('/auth/login');
    }
  }
  next();
});

export default router;
