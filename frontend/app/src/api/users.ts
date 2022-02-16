import User from '@/types/User';
import UserBlock from '@/types/UserBlock';
import UserFriend from '@/types/UserFriend';
import { AxiosInstance } from 'axios';

const USERS_BASE = '/users';

export default ($axios: AxiosInstance) => ({

  // Users routes
  getUsers() {
    return $axios.get(`${USERS_BASE}`);
  },

  createUser(userData: User) {
    return $axios.post(`${USERS_BASE}`, { userData });
  },

  getUserByUsername(username: User['username']) {
    return $axios.get(`${USERS_BASE}/${username}`);
  },

  getUserById(userId: User['id']) {
    return $axios.get(`${USERS_BASE}/${userId}`);
  },

  getUserFriends(userId: User['id']) {
    return $axios.get(`${USERS_BASE}/${userId}/friends`);
  },

  getUserBlocked(userId: User['id']) {
    return $axios.get(`${USERS_BASE}/${userId}/blocked`);
  },

  getUserChannels(userId: User['id']) {
    return $axios.get(`${USERS_BASE}/${userId}/channels`);
  },

  getUserGamesHistory(userId: User['id']) {
    return $axios.get(`${USERS_BASE}/${userId}/games_history`);
  },

  editUser(userId: User['id'], userData: User) {
    return $axios.patch(`${USERS_BASE}/${userId}`, { userData });
  },

  deleteUser(userId: User['id']) {
    return $axios.delete(`${USERS_BASE}/${userId}`);
  },

  // User's friends routes
  addUserFriend(userId: User['id'], userFriendId: User['id']) {
    return $axios.post(`${USERS_BASE}/${userId}/friends`, { userFriendId });
  },

  updateUserFriend(friendId: UserFriend['id'], userFriendDate: UserFriend) {
    return $axios.patch(`${USERS_BASE}/friends/${friendId}`, { userFriendDate });
  },

  deleteUserFriend(friendId: UserFriend['id']) {
    return $axios.delete(`${USERS_BASE}/friends/${friendId}`);
  },

  // User's blocked routes
  addUserBlocked(userId: User['id'], userBlockedId: User['id']) {
    return $axios.post(`${USERS_BASE}/${userId}/blocked`, { userBlockedId });
  },

  deleteUserBlocked(blockedId: UserBlock['id']) {
    return $axios.delete(`${USERS_BASE}/blocked/${blockedId}`);
  },

});
