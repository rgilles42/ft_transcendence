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

  getUserByComplex(userComplex: User['id'] | User['username']) {
    if (!Number.isNaN(+userComplex)) {
      return $axios.get(`${USERS_BASE}/${+userComplex}`);
    }
    return $axios.get(`${USERS_BASE}/${userComplex}`);
  },

  getMyUser() {
    return $axios.get(`${USERS_BASE}/me`, { params: { include: 'friends+blocked_users+games+channels' } });
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

  editUserProfile(userId: User['id'], data: any) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    return $axios.patch(`${USERS_BASE}/${userId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  },

  editUser(userId: User['id'], userData: User) {
    return $axios.patch(`${USERS_BASE}/${userId}`, { userData });
  },

  deleteUser(userId: User['id']) {
    return $axios.delete(`${USERS_BASE}/${userId}`);
  },

  // User's friends routes
  addUserFriend(userId: User['id'], targetUserId: User['id']) {
    return $axios.post(`${USERS_BASE}/${userId}/friends`, { targetUserId });
  },

  updateUserFriend(friendId: UserFriend['id']) {
    return $axios.patch(`${USERS_BASE}/friends/${friendId}`);
  },

  deleteUserFriend(friendId: UserFriend['id']) {
    return $axios.delete(`${USERS_BASE}/friends/${friendId}`);
  },

  // User's blocked routes
  addUserBlocked(userId: User['id'], targetUserId: User['id']) {
    return $axios.post(`${USERS_BASE}/${userId}/blocked`, { targetUserId });
  },

  deleteUserBlocked(blockedId: UserBlock['id']) {
    return $axios.delete(`${USERS_BASE}/blocked/${blockedId}`);
  },

});
