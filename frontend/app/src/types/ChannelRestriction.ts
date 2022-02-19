/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import Channel from './Channel';
import User from './User';

export default interface ChannelRestriction {
  id: number;
  channelId: number,
  userId: boolean,
  type: number,
  endAt: Date | null;
  createdAt: Date;
  updatedAt: Date;

  channel?: Channel,
  user?: User,

  [propName: string]: any;
};
