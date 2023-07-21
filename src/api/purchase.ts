import axios from "axios";

const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';

export const postPurchaseData = async (authToken: string, Amt: number, planId: number, planName: string, storeId: number) => {
	try {
		const response = await axios.post(`${baseUrl}/orders`,{
      Amt,
      planId,
      planName,
      storeId,
    }, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});

		return response.data;
	} catch (error) {
		console.error('[Get Orders Data Failed]: ', error);
	}
};