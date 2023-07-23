import { PlanType } from '../pages/OwnerStore/OwnerPlans';
import apiHelper from '../util/helpers';

// store
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
	return apiHelper.put(`/owner/stores/${id}`, data);
}

// classes
function getStoreClasses(id: number) {
	return apiHelper.get(`/owner/stores/${id}/classes`);
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
	return apiHelper.post(`/owner/stores/${storeId}/classes`, {
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
	return apiHelper.put(`/owner/classes/${id}`, {
		weekDay,
		startTime,
		endTime,
		headcount,
		className,
	});
}

function deleteClass(id: number) {
	return apiHelper.delete(`/owner/classes/${id}`);
}

// plans
function getStorePlans(id: number) {
	return apiHelper.get(`/owner/stores/${id}/plans`);
}

function createPlan(id: number, { planAmount, planName, planType, price }: PlanType) {
	return apiHelper.post(`/owner/stores/${id}/plans`, { planName, planType, planAmount, price });
}

function updatePlan({ id, planName, planType, planAmount, price }: PlanType) {
	return apiHelper.put(`/owner/plans/${id}`, { planName, planType, planAmount, price });
}

function deletePlan(id: number) {
	return apiHelper.delete(`owner/plans/${id}`);
}

// reviews
function getStoreReviews(id: number) {
	return apiHelper.get(`/owner/stores/${id}/reviews`);
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
	createPlan,
	updatePlan,
	deletePlan,

	// reviews
	getStoreReviews,
};
