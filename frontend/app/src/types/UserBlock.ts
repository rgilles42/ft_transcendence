/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
export default interface UserBlock {
  id: number;
  userId: number;
  friendId: number;
  createdAt: Date;
  status: boolean;
};
