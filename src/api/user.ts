import apiHelper from '../util/helpers';

function getUserData() {
	return apiHelper.get('/users/account');
}

function updateUserAccount(data: FormData) {
	return apiHelper.put('/users/account', data);
}

export { getUserData, updateUserAccount };
