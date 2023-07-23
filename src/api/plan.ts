import axios from "axios";

const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';
// const baseUrl = 'https://isports.tw/api';

// 取得使用者目前擁有方案
export const fetchUserPlans = async (authToken: string, storeId: number) => {
	try {
		const response = await axios.get(`${baseUrl}/users/plans?store_id=${storeId}`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		
		return { res: response.data, noPlans: undefined };
	} catch (error) {
		console.error('[Get Plans Data Failed]: ', error);
		if((error as any).response.data.status === 'error') {
			const noPlans = (error as any).response.data.status;				
			return { res: undefined, noPlans };
		}
		
	}
};

// 預約課程
export const bookingClass = async (authToken: string, classId: number, userPlanId :number, remark: string) => {
	try {
		const response = await axios.post(`${baseUrl}/classes/${classId}`, {
			userPlanId,
			remark,
		}, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});    
		
		return response.data;
	} catch (error) {
		console.error('[Booking class Failed]: ', error);
	}
};