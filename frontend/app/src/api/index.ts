import axios from 'axios';

import Users from './users';

const $axios = axios.create({
	baseURL: process.env.VUE_APP_API_URL,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
	},
	withCredentials: true,
});

const repositories = {
	users: Users($axios),
};

export default repositories;