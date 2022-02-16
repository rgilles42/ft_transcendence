import { AxiosInstance } from 'axios';

const AUTH_BASE = '/games';

export default ($axios: AxiosInstance) => ({

  // Games routes
  getGames() {
    return $axios.get(`${AUTH_BASE}`);
  },

  createGame(gameData: any) {
    return $axios.post(`${AUTH_BASE}`, { gameData });
  },

  getGameById(gameId: number) {
    return $axios.get(`${AUTH_BASE}/${gameId}`);
  },

  editGame(gameId: number, game: any) {
    return $axios.patch(`${AUTH_BASE}/${gameId}`, { game });
  },

  deleteGameById(gameId: number) {
    return $axios.delete(`${AUTH_BASE}/${gameId}`);
  },

});
