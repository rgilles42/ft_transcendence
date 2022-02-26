/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import User from './User';

export default interface UserBlock {
  id: number;
  userId: number;
  blockedId: number;
  createdAt: Date;

  user?: User;
  blocked?: User;

  [propName: string]: any;
};
