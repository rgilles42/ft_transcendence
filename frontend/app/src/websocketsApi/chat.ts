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

  onConnectionFailed(cb: (err: Error) => void) {
    return this.getInstance.on('connect_error', cb);
  },

  offConnectionFailed() {
    return this.getInstance.off('connect_error');
  },

  onConnectionSuccess(cb: () => void) {
    return this.getInstance.on('connect', cb);
  },

  offConnectionSuccess() {
    return this.getInstance.off('connect');
  },

  onNewMessage(cb: (args: ChannelMessage) => void) {
    return this.getInstance.on('newMessage', cb);
  },

  offNewMessage() {
    return this.getInstance.off('newMessage');
  },

  emitNewMessage(channelId: ChannelMessage['id'], content: ChannelMessage['content']) {
    return this.getInstance.emit('sendMessage', { channelId, content });
  },

  joinChannel(channelId: ChannelMessage['id']) {
    return this.getInstance.emit('joinChannel', { channelId });
  },

});
