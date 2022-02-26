import Channel from '@/types/Channel';
import User from '@/types/User';
import { compareAscDateFns } from './formater';
import * as userUtils from './userUtils';

export const getChatTitle = (chatData: Channel | null | undefined, me?: User | null | undefined) => {
  if (!chatData || !chatData.members) return '';
  let title = '';
  chatData.members.forEach((member) => {
    if (!userUtils.isSameUser(me || null, member.user || null)) {
      if (member.user) {
        if (title.length <= 0) {
          title = `${member.user.username}`;
        } else {
          title += `, ${member.user.username}`;
        }
      }
    }
  });
  return title;
};

export const getChatMessages = (chatData: Channel | null | undefined) => {
  if (!chatData || !chatData.messages) return [];
  return chatData.messages;
};

export const getChatRestrictions = (chatData: Channel | null | undefined) => {
  if (!chatData || !chatData.restrictions) return [];
  return chatData.restrictions;
};

export const isUserMuted = (chatData: Channel | null | undefined, userId: User['id'] | null | undefined) => {
  if (userId === undefined || userId === null) return false;
  const currentDate = new Date();
  return getChatRestrictions(chatData).some((restrictedUser) => {
    if ((userId !== restrictedUser.userId)) return false;
    if (restrictedUser.endAt === null) return true;
    return (compareAscDateFns(currentDate, restrictedUser.endAt) <= 0);
  });
};

export default {
  getChatTitle,
  getChatMessages,
  getChatRestrictions,
};
