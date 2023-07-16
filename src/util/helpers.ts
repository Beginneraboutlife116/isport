import axios, { isAxiosError } from 'axios';

const baseURL = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';

const instance = axios.create({
	baseURL,
});

instance.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

const apiHelper = instance;

export default apiHelper;
export { isAxiosError };
