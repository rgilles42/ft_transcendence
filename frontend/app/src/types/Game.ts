/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
/* eslint-disable import/no-cycle */

import User from './User';

export default interface Game {
  id: number;
  player1Id: number;
  player2Id: number;
  player1Score: number;
  player2Score: number;
  powerUps: string[];
  map: string;
  createdAt: Date;
  endAt: Date;

  player1?: User;
  player2?: User;

  [propName: string]: any;
};

export const DEFAULT_USER_BLOCK: Game = {
  id: -1,
  player1Id: -1,
  player2Id: -1,
  player1Score: 0,
  player2Score: 0,
  powerUps: [],
  map: 'default',
  createdAt: new Date(),
  endAt: new Date(),
}
