/* eslint-disable import/no-cycle */
import { configService } from '@/services/configService';
import { ManagerOptions, SocketOptions } from 'socket.io-client';
import UsersStatus from './usersStatus';
import Chat from './chat';
import Game from './game';

const socketOptions: Partial<ManagerOptions & SocketOptions> = {
  autoConnect: false,
  reconnection: false,
  forceNew: true,
  withCredentials: true,
};

const repositories = {
  usersStatus: UsersStatus(configService.getWebSocketUrl(), socketOptions),
  chat: Chat(configService.getWebSocketUrl(), socketOptions),
  game: Game(configService.getWebSocketUrl(), socketOptions),
};

export default repositories;
