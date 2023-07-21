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

function getStoreClasses(id: number) {
	return apiHelper.get(`/owner/stores/${id}/classes`);
}

function createStore(data: FormData) {
	return apiHelper.post('/owner/stores', data);
}

function updateStore(id: number, data: FormData) {
	return apiHelper.put(`owner/stores/${id}`, data);
}

function deleteClass(id: number) {
	return apiHelper.delete(`owner/classes/${id}`);
}

export {
	getOwnerData,
	getOwnerStores,
	getOneStore,
	getStoreClasses,
	createStore,
	updateStore,
	deleteClass,
};
