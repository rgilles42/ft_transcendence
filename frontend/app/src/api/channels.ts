import { AxiosInstance } from 'axios';

const AUTH_BASE = '/channels';

export default ($axios: AxiosInstance) => ({

  // Channels routes
  getChannels() {
    return $axios.get(`${AUTH_BASE}`);
  },

  createChannel(channelData: any) {
    return $axios.post(`${AUTH_BASE}`, { channelData });
  },

  getChannelById(channelId: number) {
    return $axios.get(`${AUTH_BASE}/${channelId}`);
  },

  getChannelMembersById(channelId: number) {
    return $axios.get(`${AUTH_BASE}/${channelId}/members`);
  },

  getChannelMessagesById(channelId: number) {
    return $axios.get(`${AUTH_BASE}/${channelId}/messages`);
  },

  getChannelRestrictionsById(channelId: number) {
    return $axios.get(`${AUTH_BASE}/${channelId}/restrictions`);
  },

  editChannelById(channelId: number, channel: any) {
    return $axios.patch(`${AUTH_BASE}/${channelId}`, { channel });
  },

  deleteChannelById(channelId: number) {
    return $axios.delete(`${AUTH_BASE}/${channelId}`);
  },

  // Channel's members routes
  addChannelMembers(channelId: number, memberData: any) {
    return $axios.post(`${AUTH_BASE}/${channelId}/members`, { memberData });
  },

  editChannelMembers(memberId: number, memberData: any) {
    return $axios.patch(`${AUTH_BASE}/members/${memberId}`, { memberData });
  },

  deleteChannelMembersById(memberId: number) {
    return $axios.delete(`${AUTH_BASE}/members/${memberId}`);
  },

  // Channel's messages routes
  addChannelMessages(channelId: number, messageData: any) {
    return $axios.post(`${AUTH_BASE}/${channelId}/messages`, { messageData });
  },

  editChannelMessages(messageId: number, messageData: any) {
    return $axios.patch(`${AUTH_BASE}/messages/${messageId}`, { messageData });
  },

  deleteChannelMessagesById(messageId: number) {
    return $axios.delete(`${AUTH_BASE}/messages/${messageId}`);
  },

  // Channel's restrictions routes
  addChannelRestrictions(channelId: number, restrictionData: any) {
    return $axios.post(`${AUTH_BASE}/${channelId}/restrictions`, { restrictionData });
  },

  editChannelRestrictions(restrictionId: number, restrictionData: any) {
    return $axios.patch(`${AUTH_BASE}/restrictions/${restrictionId}`, { restrictionData });
  },

  deleteChannelRestrictionsById(restrictionId: number) {
    return $axios.delete(`${AUTH_BASE}/restrictions/${restrictionId}`);
  },

});
