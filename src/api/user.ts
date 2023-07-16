import apiHelper from '../util/helpers';

function getUserData() {
	return apiHelper.get('/users/account');
}

export { getUserData };
