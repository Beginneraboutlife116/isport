import axios from "axios";

const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';

// 收藏場館
export const addLikeStore = async (authToken: string, storeId: number) => {
	try {
		const response = await axios.post(`${baseUrl}/stores/${storeId}/like`,null, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});    

		return response.data;
	} catch (error) {
		console.error('[Add Like Stores Failed]: ', error);
	}
};

// 取消收藏場館
export const deleteLikeStore = async (authToken: string, storeId: number) => {
	try {
		const response = await axios.post(`${baseUrl}/stores/${storeId}/unlike`, null, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});    
		
		return response.data;
	} catch (error) {
		console.error('[Delete Like Stores Failed]: ', error);
	}
};