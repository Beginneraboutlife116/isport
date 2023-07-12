import { useReducer } from 'react';
const errors = {
	email: {
		empty: 'Email 不可為空',
		pattern: 'Email 格式不對',
		exist: 'Email 已重複註冊',
		notExist: 'Email 不存在',
	},
	name: {
		empty: '商家名稱 不可為空',
		storeExceed: '商家名稱 超過 50 個字',
		exist: '商家名稱 已重複註冊',
		userExceed: '暱稱 超過 50 個字',
	},
	password: {
		empty: '密碼 不可為空',
	},
	confirmedPassword: {
		empty: '確認密碼 不可為空',
		different: '密碼 與 確認密碼 不一致',
	},
	avatar: {
		notSupport: '不支援的圖片格式',
	},
};

type initialKeysType = {
	email?: string;
	name?: string;
	password?: string;
	confirmedPassword?: string;
	avatar?: string;
};

export type ActionType = {
	type: 'email' | 'password' | 'confirmedPassword' | 'name' | 'avatar';
	status:
		| 'empty'
		| 'pattern'
		| 'exist'
		| 'notExist'
		| 'storeExceed'
		| 'userExceed'
		| 'different'
		| 'notSupport'
		| 'pass';
};

function errorsReducer(state: initialKeysType, { type, status }: ActionType): initialKeysType {
	if (!errors[type]) {
		throw new Error('你傳入了不存在的 error key 名稱');
	} else {
		return { ...state, [type]: status };
	}
}

/**
 * 管理目前為止的 form input 錯誤
 *
 * @param {initialKeysType} initialKeys - 目前錯誤發生的名稱，會作為 key 去找尋是否有對應的 錯誤訊息資料
 * @returns {object} 一個物件，包含 所有的錯誤訊息、錯誤訊息的 key 群，以及 動作函式
 * 該動作函式要傳入 type, status， type 是指對應的錯誤訊息名稱，而 status 則可依據錯誤訊息提供的 key 去找尋對應的錯誤訊息並顯示在 input 下方
 */
export function useErrors(
	initialKeys: initialKeysType = {
		email: '',
		name: '',
		password: '',
		confirmedPassword: '',
		avatar: '',
	},
) {
	const [state, dispatch] = useReducer(errorsReducer, initialKeys);
	return {
		errors,
		state,
		dispatch,
	};
}
