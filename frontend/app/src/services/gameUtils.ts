import Game from '@/types/Game';

export const getGameWinner = (gameData: Game | null | undefined) => {
  if (!gameData) {
    return -1;
  }
  if (gameData.player1Score < gameData.player2Score) {
    return gameData.player2Id;
  }
  return gameData.player1Id;
};

export default {
  getGameWinner,
};
