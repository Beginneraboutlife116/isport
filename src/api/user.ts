import apiHelper from '../util/helpers';

type updateUserPasswordProps = {
	password: string;
	confirmPassword: string;
};

function getUserData() {
	return apiHelper.get('/users/account');
}

function updateUserAccount(data: FormData) {
	return apiHelper.put('/users/account', data);
}

function updateUserPassword({ password, confirmPassword }: updateUserPasswordProps) {
	return apiHelper.put('/users/password', { password, confirmPassword });
}

export { getUserData, updateUserAccount, updateUserPassword };
