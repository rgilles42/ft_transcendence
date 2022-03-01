import ChannelRestriction from '@/types/ChannelRestriction';
import ChannelMember from '@/types/ChannelMember';
import ChannelMessage from '@/types/ChannelMessage';
import {
  io, ManagerOptions, Socket, SocketOptions,
} from 'socket.io-client';

const AUTH_BASE = '/chat';

let instance: Socket | null = null;

export default (baseUrl: string, options: Partial<ManagerOptions & SocketOptions>) => ({
  get getInstance() {
    if (!instance) {
      instance = io(`${baseUrl}${AUTH_BASE}`, options);
    }
    return instance;
  },

  get connected() {
    return this.getInstance.connected;
  },

  get disconnected() {
    return this.getInstance.disconnected;
  },

  connect() {
    return this.getInstance.connect();
  },

  disconnect() {
    return this.getInstance.disconnect();
  },

  onConnectionSuccess(cb: () => void) {
    return this.getInstance.on('connect', cb);
  },

  offConnectionSuccess(cb: () => void) {
    return this.getInstance.off('connect', cb);
  },

  onConnectionFailed(cb: (err: Error) => void) {
    return this.getInstance.on('connect_error', cb);
  },

  offConnectionFailed(cb: (err: Error) => void) {
    return this.getInstance.off('connect_error', cb);
  },

  onDisconnected(cb: (reason: Socket.DisconnectReason) => void) {
    return this.getInstance.on('disconnect', cb);
  },

  offDisconnected(cb: (reason: Socket.DisconnectReason) => void) {
    return this.getInstance.off('disconnect', cb);
  },

  onNewMessage(cb: (args: ChannelMessage) => void) {
    return this.getInstance.on('newMessage', cb);
  },

  offNewMessage(cb: (args: ChannelMessage) => void) {
    return this.getInstance.off('newMessage', cb);
  },

  onNewMember(cb: (args: ChannelMember) => void) {
    return this.getInstance.on('newMember', cb);
  },

  offNewMember(cb: (args: ChannelMember) => void) {
    return this.getInstance.off('newMember', cb);
  },

  onDeletedMember(cb: (args: ChannelMember['id']) => void) {
    return this.getInstance.on('deletedMember', cb);
  },

  offDeletedMember(cb: (args: ChannelMember['id']) => void) {
    return this.getInstance.off('deletedMember', cb);
  },

  onNewRestriction(cb: (args: ChannelRestriction) => void) {
    return this.getInstance.on('newRestriction', cb);
  },

  offNewRestriction(cb: (args: ChannelRestriction) => void) {
    return this.getInstance.off('newRestriction', cb);
  },

  onDeletedRestriction(cb: (args: ChannelRestriction['id']) => void) {
    return this.getInstance.on('deletedRestriction', cb);
  },

  offDeletedRestriction(cb: (args: ChannelRestriction['id']) => void) {
    return this.getInstance.off('deletedRestriction', cb);
  },

  emitNewMessage(channelId: ChannelMessage['id'], content: ChannelMessage['content']) {
    return this.getInstance.emit('sendMessage', { channelId, content });
  },

  joinChannel(channelId: ChannelMessage['id']) {
    return this.getInstance.emit('joinChannel', { channelId });
  },

});
