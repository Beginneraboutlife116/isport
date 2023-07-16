import apiHelper from '../util/helpers';

type LoginType = {
	email: string;
	password: string;
};

type SignupType = LoginType & {
	confirmPassword: string;
};

type StoreSignupType = SignupType & {
	storeName: string;
};

function login({ email, password }: LoginType) {
	return apiHelper.post('/signin', { email, password });
}

function signup({ email, password, confirmPassword }: SignupType) {
	return apiHelper.post('/users', { email, password, confirmPassword });
}

function storeLogin({ email, password }: LoginType) {
	return apiHelper.post('/owner/signin', { email, password });
}

function storeSignup({ email, password, confirmPassword, storeName }: StoreSignupType) {
	return apiHelper.post('/owner/users', { email, password, confirmPassword, storeName });
}

export { login, signup, storeLogin, storeSignup };
