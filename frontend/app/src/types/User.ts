/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import UserFriend from './UserFriend';
import UserBlock from './UserBlock';
import Channel from './Channel';
import Game from './Game';

export default interface User {
  id: number;
  login: string;
  username: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  fa?: string;
  status: number;
  activity?: string;

  friends?: UserFriend[];
  blocked?: UserBlock[];
  channels?: Channel[];
  games?: Game[];

  [propName: string]: any;
};
