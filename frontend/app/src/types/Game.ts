/* eslint-disable @typescript-eslint/no-extra-semi */
/* eslint-disable semi */
export default interface Game {
  id: number;
  player1Id: number,
  player2Id: number,
  player1Score: number,
  player2Score: number,
  powerUps: string[];
  map: string;
  createdAt: Date;
  endAt: Date;
};
