/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import User from './User';

export default interface UserFriend {
  id: number;
  userId: number;
  friendId: number;
  createdAt: Date;
  updatedAt: Date;
  status: boolean;

  user?: User,
  friend?: User,

  [propName: string]: any;
};
