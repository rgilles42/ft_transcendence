import Channel from '@/types/Channel';
import User from '@/types/User';
import { compareAscDateFns } from './formater';

export const getChatMembers = (chatData: Channel | null | undefined) => {
  if (!chatData || !chatData.members) return [];
  return chatData.members;
};

export const getChatMessages = (chatData: Channel | null | undefined) => {
  if (!chatData || !chatData.messages) return [];
  return chatData.messages;
};

export const getChatRestrictions = (chatData: Channel | null | undefined) => {
  if (!chatData || !chatData.restrictions) return [];
  return chatData.restrictions;
};

export const getMemberIndex = (chatData : Channel | null | undefined, userId: User['id'] | null | undefined) => {
  if (userId === undefined || userId === null) {
    return -1;
  }
  const members = getChatMembers(chatData);
  return members.findIndex((member) => userId === member.userId);
};

export const getMember = (chatData : Channel | null | undefined, userId: User['id'] | null | undefined) => {
  if (userId === undefined || userId === null) {
    return undefined;
  }
  const index = getMemberIndex(chatData, userId);
  if (index <= -1) {
    return undefined;
  }
  const members = getChatMembers(chatData);
  return members[index];
};

export const isUserIsOwner = (chatData: Channel | null | undefined, userId: User['id'] | null | undefined) => {
  if (userId === undefined || userId === null) return false;
  if (!chatData) return false;
  return (chatData.ownerId === userId);
};

export const isUserIsMember = (chatData: Channel | null | undefined, userId: User['id'] | null | undefined) => {
  if (userId === undefined || userId === null) return false;
  if (isUserIsOwner(chatData, userId)) return true;
  return getChatMembers(chatData).some((member) => (userId === member.userId));
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
  getChatMessages,
  getChatRestrictions,
};
