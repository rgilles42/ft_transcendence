/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import ChannelMember from './ChannelMember';
import ChannelMessage from './ChannelMessage';
import ChannelRestriction from './ChannelRestriction';
import User from './User';

export default interface Channel {
  id: number;
  ownerId: number;
  isPrivate: boolean;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;

  owner?: User;
  members?: ChannelMember[];
  messages?: ChannelMessage[];
  restrictions?: ChannelRestriction[];

  [propName: string]: any;
};

export const DEFAULT_CHANNEL: Channel = {
  id: -1,
  ownerId: -1,
  isPrivate: false,
  password: null,
  createdAt: new Date(),
  updatedAt: new Date(),
}
