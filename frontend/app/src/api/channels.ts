import Channel from '@/types/Channel';
import ChannelMember from '@/types/ChannelMember';
import ChannelMessage from '@/types/ChannelMessage';
import ChannelRestriction from '@/types/ChannelRestriction';
import User from '@/types/User';
import { AxiosInstance } from 'axios';

const AUTH_BASE = '/channels';

export default ($axios: AxiosInstance) => ({

  // Channels routes
  getChannels() {
    return $axios.get(`${AUTH_BASE}`, { params: { include: 'members+restrictions' } });
  },

  createChannel(channelData: Channel) {
    return $axios.post(`${AUTH_BASE}`, channelData);
  },

  requestEnterInChannel(channelId: Channel['id'], userId: User['id'], password?: Channel['password']) {
    return $axios.post(`${AUTH_BASE}/${channelId}/members`, { userId, password });
  },

  getChannelById(channelId: Channel['id']) {
    return $axios.get(`${AUTH_BASE}/${channelId}`, { params: { include: 'members+restrictions+messages' } });
  },

  getChannelMembersById(channelId: Channel['id']) {
    return $axios.get(`${AUTH_BASE}/${channelId}/members`);
  },

  getChannelMessagesById(channelId: Channel['id']) {
    return $axios.get(`${AUTH_BASE}/${channelId}/messages`);
  },

  getChannelRestrictionsById(channelId: Channel['id']) {
    return $axios.get(`${AUTH_BASE}/${channelId}/restrictions`);
  },

  editChannelById(channelId: Channel['id'], channelData: Channel) {
    return $axios.patch(`${AUTH_BASE}/${channelId}`, channelData);
  },

  deleteChannelById(channelId: Channel['id']) {
    return $axios.delete(`${AUTH_BASE}/${channelId}`);
  },

  // Channel's members routes
  addChannelMembers(channelId: Channel['id'], memberUsername: string) {
    return $axios.post(`${AUTH_BASE}/${channelId}/members`, memberUsername);
  },

  editChannelMembers(memberId: ChannelMember['id'], isAdmin: ChannelMember['isAdmin']) {
    return $axios.patch(`${AUTH_BASE}/members/${memberId}`, { isAdmin });
  },

  deleteChannelMembersById(memberId: ChannelMember['id']) {
    return $axios.delete(`${AUTH_BASE}/members/${memberId}`);
  },

  // Channel's messages routes
  addChannelMessages(channelId: Channel['id'], messageData: ChannelMessage) {
    return $axios.post(`${AUTH_BASE}/${channelId}/messages`, { messageData });
  },

  editChannelMessages(messageId: ChannelMessage['id'], messageData: ChannelMessage) {
    return $axios.patch(`${AUTH_BASE}/messages/${messageId}`, { messageData });
  },

  deleteChannelMessagesById(messageId: ChannelMessage['id']) {
    return $axios.delete(`${AUTH_BASE}/messages/${messageId}`);
  },

  // Channel's restrictions routes
  addChannelRestrictions(channelId: Channel['id'], userId: User['id'], type: ChannelRestriction['type'], endAt?: ChannelRestriction['endAt']) {
    return $axios.post(`${AUTH_BASE}/${channelId}/restrictions`, { userId, type, endAt });
  },

  editChannelRestrictions(restrictionId: ChannelRestriction['id'], restrictionData: ChannelRestriction) {
    return $axios.patch(`${AUTH_BASE}/restrictions/${restrictionId}`, { restrictionData });
  },

  deleteChannelRestrictionsById(restrictionId: ChannelRestriction['id']) {
    return $axios.delete(`${AUTH_BASE}/restrictions/${restrictionId}`);
  },

});
