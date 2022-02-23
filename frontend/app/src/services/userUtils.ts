import UserBlock from '@/types/UserBlock';
import UserFriend from '@/types/UserFriend';
import User from '@/types/User';

export const isSameUser = (currentUser: User | null, user: User | null): boolean => {
  if (!currentUser || !user) {
    return false;
  }
  return currentUser.id === user.id;
};

export const getUserBlocked = (currentUser: User | null, user: User | null): UserBlock | undefined => {
  if (!currentUser || !user) {
    return undefined;
  }
  if (!currentUser.blocked) {
    return undefined;
  }
  return currentUser.blocked.find((blocked) => (currentUser.id === blocked.userId && user.id === blocked.blockedId));
};

export const isUserIsBlocked = (currentUser: User | null, user: User | null): boolean => {
  const blocked = getUserBlocked(currentUser, user);
  return (blocked !== undefined);
};

export const canUserBeBlocked = (currentUser: User | null, user: User | null): boolean => {
  if (!currentUser || !user) {
    return false;
  }
  if (currentUser.id === user.id) {
    return false;
  }
  const blocked = getUserBlocked(currentUser, user);
  if (blocked) {
    return false;
  }
  return true;
};

export const getUserFriend = (currentUser: User | null, user: User | null): UserFriend | undefined => {
  if (!currentUser || !user) {
    return undefined;
  }
  if (!currentUser.friends) {
    return undefined;
  }
  return currentUser.friends.find((friend) => (currentUser.id === friend.userId && user.id === friend.friendId) || (currentUser.id === friend.friendId && user.id === friend.userId));
};

export const isUserIsFriend = (currentUser: User | null, user: User | null): boolean => {
  if (!currentUser || !user) {
    return false;
  }
  const friend = getUserFriend(currentUser, user);
  if (!friend) {
    return false;
  }
  return (friend.status === true);
};

export const canUserBeFriend = (currentUser: User | null, user: User | null): boolean => {
  if (!currentUser || !user) {
    return false;
  }
  if (currentUser.id === user.id) {
    return false;
  }
  const friend = getUserFriend(currentUser, user);
  if (friend) {
    return false;
  }
  return true;
};

export const canUserAcceptFriend = (currentUser: User | null, user: User | null): boolean => {
  if (!currentUser || !user) {
    return false;
  }
  const friend = getUserFriend(currentUser, user);
  if (!friend) {
    return false;
  }
  return (friend.status === false && friend.userId === user.id);
};

export default {
  isSameUser,
  getUserBlocked,
  isUserIsBlocked,
  canUserBeBlocked,
  getUserFriend,
  isUserIsFriend,
  canUserBeFriend,
  canUserAcceptFriend,
};
