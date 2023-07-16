import apiHelper from '../util/helpers';

type LoginType = {
	email: string;
	password: string;
};

type SignupType = {
	email: string;
	password: string;
	confirmPassword: string;
};

function login({ email, password }: LoginType) {
	return apiHelper.post('/signin', { email, password });
}

function signup({ email, password, confirmPassword }: SignupType) {
	return apiHelper.post('/users', { email, password, confirmPassword });
}

export { login, signup };
