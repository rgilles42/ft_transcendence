/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import User from './User';

export default interface UserFriend {
  id: number;
  userId: number;
  friendId: number;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;

  user?: User;
  friend?: User;

  [propName: string]: any;
};

export const DEFAULT_USER_FRIEND: UserFriend = {
  id: -1,
  userId: -1,
  friendId: -1,
  status: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}
