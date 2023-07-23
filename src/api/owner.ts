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

function getStorePlans(id: number) {
	return apiHelper.get(`/owner/stores/${id}/plans`);
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

function deletePlan(id: number) {
	return apiHelper.delete(`owner/plans/${id}`);
}

function createClass(
	storeId: number,
	{
		weekDay,
		startTime,
		endTime,
		headcount,
		className,
	}: { weekDay: string; startTime: string; endTime: string; headcount: number; className: string },
) {
	return apiHelper.post(`owner/stores/${storeId}/classes`, {
		weekDay,
		startTime,
		endTime,
		headcount,
		className,
	});
}

function updateClass({
	id,
	weekDay,
	startTime,
	endTime,
	headcount,
	className,
}: {
	id: number;
	weekDay: string;
	startTime: string;
	endTime: string;
	headcount: number;
	className: string;
}) {
	return apiHelper.put(`owner/classes/${id}`, {
		weekDay,
		startTime,
		endTime,
		headcount,
		className,
	});
}

export {
	// store
	getOwnerData,
	getOwnerStores,
	getOneStore,
	createStore,
	updateStore,

	// class
	createClass,
	getStoreClasses,
	updateClass,
	deleteClass,

	// plan
	getStorePlans,
	deletePlan,
};
