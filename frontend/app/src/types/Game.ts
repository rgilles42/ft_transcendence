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
  endAt: Date | null;

  player1?: User;
  player2?: User;

  [propName: string]: any;
};

export interface GameObject {
  leftGoUp: boolean;
  leftGoDown: boolean;
  rightGoUp: boolean;
  rightGoDown: boolean;
  racketLen: number;
  leftRacketPos: number;
  rightRacketPos: number;
  ball: {
    size: number;
    xPos: number;
    yPos: number;
    xSpeed: number;
    ySpeed: number;
  };
  entity?: Game;
  player1Ready: boolean;
  player2Ready: boolean;
  state: number;
}

export const DEFAULT_GAME: Game = {
  id: -1,
  player1Id: -1,
  player2Id: -1,
  player1Score: 0,
  player2Score: 0,
  powerUps: [],
  map: 'default',
  createdAt: new Date(),
  endAt: null,
}
