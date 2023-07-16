import axios from "axios";

const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';

// 收藏場館
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
		console.log(response);
		
		return response.data;
	} catch (error) {
		console.error('[Add Review Failed]: ', error);
	}
};