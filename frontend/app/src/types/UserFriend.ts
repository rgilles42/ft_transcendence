/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
export default interface UserFriend {
  id: number;
  userId: number;
  friendId: number;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;
};
