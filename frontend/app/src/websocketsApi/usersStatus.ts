import User from '@/types/User';
import {
  io, ManagerOptions, Socket, SocketOptions,
} from 'socket.io-client';

const AUTH_BASE = '/usersStatus';

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

  onUsersStatusUpdate(cb: (args: [{ id: number, newStatus: number }]) => void) {
    return this.getInstance.on('usersStatusUpdate', cb);
  },

  offUsersStatusUpdate() {
    return this.getInstance.off('usersStatusUpdate');
  },

  emitNewStatus(newStatus: User['status']) {
    return this.getInstance.emit('changeStatus', { newStatus });
  },

});
