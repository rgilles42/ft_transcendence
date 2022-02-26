import UserBlock from '@/types/UserBlock';
import UserFriend from '@/types/UserFriend';
import User from '@/types/User';

export const isSameUser = (currentUser: User | null, user: User | null): boolean => {
  if (!currentUser || !user) {
    return false;
  }
  return currentUser.id === user.id;
};

export const getUserBlockedIndex = (currentUser: User | null, user: User | null): number => {
  if (!currentUser || !user) {
    return -1;
  }
  if (!currentUser.blockedUsers) {
    return -1;
  }
  return currentUser.blockedUsers.findIndex((blocked) => (currentUser.id === blocked.userId && user.id === blocked.blockedId));
};

export const getUserBlocked = (currentUser: User | null, user: User | null): UserBlock | undefined => {
  if (!currentUser || !user) {
    return undefined;
  }
  if (!currentUser.blockedUsers) {
    return undefined;
  }
  const index = getUserBlockedIndex(currentUser, user);
  if (index <= -1) {
    return undefined;
  }
  return currentUser.blockedUsers[index];
};

export const getUserBlockeds = (currentUser: User | null): User[] => {
  if (!currentUser || !currentUser.blockedUsers) {
    return [];
  }
  const blockeds: User[] = [];
  currentUser.blockedUsers.forEach((blockedRelation) => {
    if (currentUser.id === blockedRelation.userId && blockedRelation.blockedUsers) {
      blockeds.push(blockedRelation.blockedUsers);
    }
  });
  return blockeds;
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

export const getUserFriendIndex = (currentUser: User | null, user: User | null): number => {
  if (!currentUser || !user) {
    return -1;
  }
  if (!currentUser.friends) {
    return -1;
  }
  return currentUser.friends.findIndex((friend) => (currentUser.id === friend.userId && user.id === friend.friendId) || (currentUser.id === friend.friendId && user.id === friend.userId));
};

export const getUserFriend = (currentUser: User | null, user: User | null): UserFriend | undefined => {
  if (!currentUser || !user) {
    return undefined;
  }
  if (!currentUser.friends) {
    return undefined;
  }
  const index = getUserFriendIndex(currentUser, user);
  if (index <= -1) {
    return undefined;
  }
  return currentUser.friends[index];
};

export const getUserFriends = (currentUser: User | null, strict = true): User[] => {
  if (!currentUser || !currentUser.friends) {
    return [];
  }
  const friends: User[] = [];
  currentUser.friends.forEach((friendRelation) => {
    if ((strict && friendRelation.status === true) || !strict) {
      if (currentUser.id === friendRelation.userId && friendRelation.friend) {
        friends.push(friendRelation.friend);
      } else if (currentUser.id === friendRelation.friendId && friendRelation.user) {
        friends.push(friendRelation.user);
      }
    }
  });
  return friends;
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
  getUserBlockedIndex,
  getUserBlocked,
  getUserBlockeds,
  isUserIsBlocked,
  canUserBeBlocked,
  getUserFriendIndex,
  getUserFriend,
  getUserFriends,
  isUserIsFriend,
  canUserBeFriend,
  canUserAcceptFriend,
};
