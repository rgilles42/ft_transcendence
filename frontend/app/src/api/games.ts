import Game from '@/types/Game';
import { AxiosInstance } from 'axios';

const AUTH_BASE = '/games';

export default ($axios: AxiosInstance) => ({

  // Games routes
  getGames() {
    return $axios.get(`${AUTH_BASE}`);
  },

  createGame(gameData: Game) {
    return $axios.post(`${AUTH_BASE}`, { gameData });
  },

  getGameById(gameId: Game['id']) {
    return $axios.get(`${AUTH_BASE}/${gameId}`);
  },

  editGame(gameId: Game['id'], gameDate: Game) {
    return $axios.patch(`${AUTH_BASE}/${gameId}`, { gameDate });
  },

  deleteGameById(gameId: Game['id']) {
    return $axios.delete(`${AUTH_BASE}/${gameId}`);
  },

});
