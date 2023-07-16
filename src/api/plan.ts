import axios from "axios";

const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';

// 取得使用者目前擁有方案
export const fetchUserPlans = async (authToken: string) => {
	try {
		const response = await axios.get(`${baseUrl}/users/plans`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		console.log(response);
		
		return response.data;
	} catch (error) {
		console.error('[Get Plans Data Failed]: ', error);
	}
};

// 預約課程
export const addComment = async (authToken: string, classId: number, userPlanId :number, remark: string) => {
	try {
		const response = await axios.post(`${baseUrl}/classes/${classId}`, {
			userPlanId,
			remark,
		}, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});    
		console.log(response);
		
		return response.data;
	} catch (error) {
		console.error('[Booking class Failed]: ', error);
	}
};