import { AxiosInstance } from 'axios';

const USERS_BASE = '/users';

export default ($axios: AxiosInstance) => ({
	login(email: string, password: string) {
		return $axios.post(`${USERS_BASE}/login`, { email, password });
	},

	getUsers() {
		return $axios.get(`${USERS_BASE}`);
	}
});
