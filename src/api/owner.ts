import apiHelper from '../util/helpers';

function getOwnerData() {
	return apiHelper.get('/owner/users/account');
}

function getOwnerStores() {
	return apiHelper.get('/owner/stores');
}

export { getOwnerData, getOwnerStores };
