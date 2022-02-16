/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
export default interface ChannelRestriction {
  id: number;
  channelId: number,
  userId: boolean,
  type: number,
  endAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
