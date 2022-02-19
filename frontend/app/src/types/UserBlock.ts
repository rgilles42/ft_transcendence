/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import User from './User';

export default interface UserBlock {
  id: number;
  userId: number;
  friendId: number;
  createdAt: Date;
  status: boolean;

  user?: User,
  friend?: User,

  [propName: string]: any;
};
