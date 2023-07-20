import apiHelper from '../util/helpers';

function getOwnerData() {
	return apiHelper.get('/owner/users/account');
}

function getOwnerStores() {
	return apiHelper.get('/owner/stores');
}
function getOneStore(id: number) {
	return apiHelper.get(`/owner/stores/${id}`);
}

function createStore(data: FormData) {
	return apiHelper.post('/owner/stores', data);
}

function updateStore(id: number, data: FormData) {
	return apiHelper.put(`owner/stores/${id}}`, data);
}

export { getOwnerData, getOwnerStores, createStore, getOneStore, updateStore };
