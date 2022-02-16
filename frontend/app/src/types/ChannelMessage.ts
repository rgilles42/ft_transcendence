/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
export default interface ChannelMessage {
  id: number;
  channelId: number,
  userId: number,
  message: string,
  createdAt: Date;
  updatedAt: Date;
};
