import axios from "axios";

const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';
// const baseUrl = 'https://isports.tw/api';

// 取消單一預約課程
export const fetchCancelStore = async (authToken: string, reservationId: number) => {
	try {
		const response = await axios.delete(`${baseUrl}/reservations/${reservationId}`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});    
    
		return response.data;
	} catch (error) {
		console.error('[Cancel class Data Failed]: ', error);
	}
};