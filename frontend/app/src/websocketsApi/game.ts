import {
  io, ManagerOptions, Socket, SocketOptions,
} from 'socket.io-client';
import Game, { GameObject } from '@/types/Game';

const AUTH_BASE = '/game';

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

  onGameStarted(cb: (args: GameObject) => void) {
    return this.getInstance.on('gameStarted', cb);
  },

  offGameStarted(cb: (args: GameObject) => void) {
    return this.getInstance.off('gameStarted', cb);
  },

  onActiveGames(cb: (args: GameObject[]) => void) {
    return this.getInstance.on('activeGames', cb);
  },

  offActiveGames(cb: (args: GameObject[]) => void) {
    return this.getInstance.off('activeGames', cb);
  },

  onUpdateGame(cb: (args: GameObject) => void) {
    return this.getInstance.on('updateGame', cb);
  },

  offUpdateGame(cb: (args: GameObject) => void) {
    return this.getInstance.off('updateGame', cb);
  },

  emitGetGames() {
    return this.getInstance.emit('getGames');
  },

  emitObserveGame(gameId: Game['id']) {
    return this.getInstance.emit('observeGame', { gameId });
  },

  emitAcceptInvit(invitingPlayerId: number, map: string) {
    return this.getInstance.emit('acceptInvit', { invitingPlayerId, map });
  },

  emitJoinMatchmaking(map: string) {
    return this.getInstance.emit('joinMatchmaking', { map });
  },

  emitKeyDown(gameId: Game['id'], direction: number) {
    return this.getInstance.emit('keyDown', { gameId, direction });
  },

  emitKeyUp(gameId: Game['id'], direction: number) {
    return this.getInstance.emit('keyUp', { gameId, direction });
  },

  emitConfirmReady(gameId: Game['id']) {
    return this.getInstance.emit('confirmReady', { gameId });
  },

});
