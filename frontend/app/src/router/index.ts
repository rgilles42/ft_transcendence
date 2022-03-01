import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { configService } from '@/services/configService';
import { useStore } from '../store/index';
import Home from '../views/Home.vue';
import Login from '../views/auth/Login.vue';
import Login2fa from '../views/auth/2fa.vue';
import Logout from '../views/auth/Logout.vue';
import FortyTwo from '../views/auth/FortyTwo.vue';
import Profile from '../views/Profile.vue';
import Chat from '../views/chat/index.vue';
import ChatCreate from '../views/chat/create.vue';
import ChatId from '../views/chat/_id/index.vue';
import ChatIdEdit from '../views/chat/_id/edit.vue';
import GameList from '../views/game/index.vue';
import GamePlay from '../views/game/play.vue';
import GameSpectator from '../views/game/spectator.vue';

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
    path: '/auth/2fa',
    name: 'Login2fa',
    component: Login2fa,
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
    name: 'ChatList',
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
    path: '/chat/:requestChatId',
    name: 'ChatId',
    component: ChatId,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/chat/:requestChatId/edit',
    name: 'ChatIdEdit',
    component: ChatIdEdit,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/game',
    name: 'GameList',
    component: GameList,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/game/:requestGameId/play',
    name: 'GamePlay',
    component: GamePlay,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/game/:requestGameId/spectator',
    name: 'GameSpectator',
    component: GameSpectator,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
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
