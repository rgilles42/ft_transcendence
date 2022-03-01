/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import Channel from './Channel';
import User from './User';

export default interface ChannelRestriction {
  id: number;
  channelId: number;
  userId: number;
  type: number;
  endAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  channel?: Channel;
  user?: User;

  [propName: string]: any;
};

export const DEFAULT_CHANNEL_RESTRICTION: ChannelRestriction = {
  id: -1,
  channelId: -1,
  userId: -1,
  type: 0,
  endAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}
