/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
export default interface ChannelMember {
  id: number;
  channelId: number,
  userId: boolean,
  isAdmin: number,
  createdAt: Date;
  updatedAt: Date;
};
