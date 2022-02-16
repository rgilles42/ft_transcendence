import User from '@/types/User';
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

  getUserByUsername(username: string) {
    return $axios.get(`${USERS_BASE}/${username}`);
  },

  getUserById(userId: number) {
    return $axios.get(`${USERS_BASE}/${userId}`);
  },

  getUserFriends(user: User) {
    return $axios.get(`${USERS_BASE}/${user.id}/friends`);
  },

  getUserBlocked(user: User) {
    return $axios.get(`${USERS_BASE}/${user.id}/blocked`);
  },

  getUserChannels(user: User) {
    return $axios.get(`${USERS_BASE}/${user.id}/channels`);
  },

  getUserGamesHistory(user: User) {
    return $axios.get(`${USERS_BASE}/${user.id}/games_history`);
  },

  editUser(user: User, data: any) {
    return $axios.patch(`${USERS_BASE}/${user.id}`, data);
  },

  deleteUser(user: User) {
    return $axios.delete(`${USERS_BASE}/${user.id}`);
  },

  // User's friends routes
  addUserFriend(user: User, userFriendId: number) {
    return $axios.post(`${USERS_BASE}/${user.id}/friends`, { userFriendId });
  },

  updateUserFriend(user: User, friendId: number, data: any) {
    return $axios.patch(`${USERS_BASE}/friends/${friendId}`, data);
  },

  deleteUserFriend(user: User, friendId: number) {
    return $axios.delete(`${USERS_BASE}/friends/${friendId}`);
  },

  // User's blocked routes
  addUserBlocked(user: User, userBlockedId: number) {
    return $axios.post(`${USERS_BASE}/${user.id}/blocked`, { userBlockedId });
  },

  deleteUserBlocked(user: User, blockedId: number) {
    return $axios.delete(`${USERS_BASE}/blocked/${blockedId}`);
  },

});
