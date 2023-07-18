import apiHelper from '../util/helpers';

function getOwnerData() {
	return apiHelper.get('/owner/users/account');
}

function getOwnerStores() {
	return apiHelper.get('/owner/stores');
}

function createStore(data: FormData) {
	return apiHelper.post('/owner/stores', data);
}

export { getOwnerData, getOwnerStores, createStore };
