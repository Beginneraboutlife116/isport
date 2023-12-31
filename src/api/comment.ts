import axios from "axios";

// const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';
const baseUrl = 'https://isports.tw/api';

// 新增評論
export const addComment = async (authToken: string, storeId: number, rating :number, content: string) => {
	try {
		const response = await axios.post(`${baseUrl}/stores/${storeId}/reviews`, {
			rating,
			content,
		}, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});    
		
		return response.data;
	} catch (error) {
		console.error('[Add Review Failed]: ', error);
	}
};