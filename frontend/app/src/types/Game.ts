/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */

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
