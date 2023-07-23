import axios from "axios";

const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';
// const baseUrl = 'https://isports.tw/api';

// 取得所有場館
export const fetchStoresData = async (authToken: string) => {
	try {
		const response = await axios.get(`${baseUrl}/stores`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});    

		return response.data;
	} catch (error) {
		console.error('[Get Stores Data Failed]: ', error);
	}
};

// 取得單一場館
export const fetchOneStoreData = async (authToken: string, storeId: number) => {
	try {
		const response = await axios.get(`${baseUrl}/stores/${storeId}`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		
		return response.data;
	} catch (error) {
		console.error('[Get Store Data Failed]: ', error);
	}
};

// 取得使用者收藏場館
export const fetchLikeStoresData = async (authToken: string) => {
	try {
		const response = await axios.get(`${baseUrl}/users/like_stores`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		
		return { res: response.data, noLikeStores: undefined };
	} catch (error) {
		console.error('[Get Like Stores Data Failed]: ', error);
			
		if((error as any).response.data.status === 'error') {
			const noLikeStores = (error as any).response.data.status;		
			return { res: undefined, noLikeStores };
		}
	}
};

// 取得使用者預約課程
export const fetchCollectionData = async (authToken: string) => {
	try {
		const response = await axios.get(`${baseUrl}/users/reservations`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		
		return { res: response.data, noReservations: undefined };
	} catch (error) {
		console.error('[Get Reservations Data Failed]: ', error);
		if((error as any).response.data.status === 'error') {
			const noReservations = (error as any).response.data.status;				
			return { res: undefined, noReservations };
		}
	}
};

// 取得單一場館課程資料
export const fetchStoreClasses = async (authToken: string, storeId: number) => {
	try {
		const response = await axios.get(`${baseUrl}/stores/${storeId}/classes`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		
		return response.data;
	} catch (error) {
		console.error('[Get Classes Data Failed]: ', error);
	}
};

// 取得場館方案
export const fetchStorePlan = async (authToken: string, storeId: number) => {
	try {
		const response = await axios.get(`${baseUrl}/stores/${storeId}/plans`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		
		return response.data;
	} catch (error) {
		console.error('[Get Plans Data Failed]: ', error);
	}
};

// 取得場館評價
export const fetchStoreReview = async (authToken: string, storeId: number) => {
	try {
		const response = await axios.get(`${baseUrl}/stores/${storeId}/reviews`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		
		return response.data;
	} catch (error) {
		console.error('[Get Plans Data Failed]: ', error);
	}
};
