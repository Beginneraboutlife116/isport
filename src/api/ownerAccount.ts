import axios from "axios";

const baseUrl = 'http://i-sport-api-env-1.eba-yaqmmn4t.ap-northeast-2.elasticbeanstalk.com/api';
// const baseUrl = 'https://isports.tw/api';

// 取得商家帳戶資料
export const fetchOwnerAccount = async (authToken: string) => {
	try {
		const response = await axios.get(`${baseUrl}/owner/users/account`, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
		return response.data;
	} catch (error) {
		console.error('[Get Owner Data Failed]: ', error);

	}
};

// 修改商家 email/store name
export const editOwnerAccount = async (authToken: string, email: string, storeName: string) => {
	try {
		const response = await axios.put(`${baseUrl}/owner/users/account`,{
      email,
      storeName
    }, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
    
		return response.data;
	} catch (error) {
		console.error('[Get Account Data Failed]: ', error);
	}
};

// 修改商家密碼
export const editOwnerPassword = async (authToken: string, password: string, confirmPassword: string) => {
	try {
		const response = await axios.put(`${baseUrl}/owner/users/password`,{
      password,
      confirmPassword
    }, {
			headers: {
				Authorization: 'Bearer ' + authToken,
			},
		});
    
		return response.data;
	} catch (error) {
		console.error('[Get Password Data Failed]: ', error);
	}
};
