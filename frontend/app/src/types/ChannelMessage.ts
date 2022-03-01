/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import Channel from './Channel';
import User from './User';

export default interface ChannelMessage {
  id: number;
  channelId: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;

  channel?: Channel;
  user?: User;

  [propName: string]: any;
};

export const DEFAULT_CHANNEL_MESSAGE: ChannelMessage = {
  id: -1,
  channelId: -1,
  userId: -1,
  content: '',
  createdAt: new Date(),
  updatedAt: new Date(),
}
