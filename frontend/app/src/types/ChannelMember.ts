/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import Channel from './Channel';
import User from './User';

export default interface ChannelMember {
  id: number;
  channelId: number;
  userId: number;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;

  channel?: Channel;
  user?: User;

  [propName: string]: any;
};
