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
    userExceed: '暱稱 超過 50 個字'
	},
	password: {
		empty: '密碼 不可為空',
	},
	confirmedPassword: {
		empty: '確認密碼 不可為空',
		different: '密碼 與 確認密碼 不一致',
	},
};

type initialKeysType = {
	email: string;
	name?: string | undefined;
	password: string;
	confirmedPassword?: string | undefined;
};

type ActionType = {
	type: 'email' | 'password' | 'confirmedPassword' | 'name';
	status: 'empty' | 'pattern' | 'exist' | 'notExist' | 'storeExceed' | 'userExceed' | 'different' | 'pass';
};

function errorsReducer(state: initialKeysType, { type, status }: ActionType): initialKeysType {
	if (!errors[type]) {
		throw new Error('你傳入了不存在的 error key 名稱');
	} else {
		return { ...state, [type]: status };
	}
}

export default function useErrors(
	initialKeys: initialKeysType = { email: '', name: '', password: '', confirmedPassword: '' },
) {
	const [state, dispatch] = useReducer(errorsReducer, initialKeys);
	return {
		errors,
		state,
		dispatch,
	};
}
