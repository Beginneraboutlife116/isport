import { useReducer } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import authStyles from '../../styles.module.scss';
import styles from '../styles.module.scss';

type ErrorsType = {
	emailErrorKey: string;
	passwordErrorKey: string;
	confirmedPasswordErrorKey: string;
	nameErrorKey: string;
};

type ErrorsAction = {
	type: string;
	status: string;
};

function errorKeyReducer(state: ErrorsType, action: ErrorsAction) {
	switch (action.type) {
		case 'email':
			return { ...state, emailErrorKey: action.status };
		case 'password':
			return { ...state, passwordErrorKey: action.status };
		case 'confirmedPassword':
			return { ...state, confirmedPasswordErrorKey: action.status };
		case 'name':
			return { ...state, nameErrorKey: action.status };
		default:
			throw new Error('你傳入了不存在的 error key 名稱');
	}
}

export default function StoreSignupPage() {
	const [state, dispatch] = useReducer(errorKeyReducer, {
		emailErrorKey: '',
		passwordErrorKey: '',
		confirmedPasswordErrorKey: '',
		nameErrorKey: '',
	});
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm();

	const emailErrors = {
		empty: 'Email 不可為空',
		pattern: 'Email 格式不對',
		exist: 'Email 已重複註冊',
	};

	const nameErrors = {
		empty: '商家名稱 不可為空',
		exceed: '商家名稱 超過 50 個字',
		exist: '商家名稱 已重複註冊',
	};

	const passwordErrors = {
		empty: '密碼 不可為空',
	};
	const confirmedPasswordErrors = {
		empty: '確認密碼 不可為空',
		different: '密碼 與 確認密碼 不一致',
	};

	return (
		<>
			<h1 className={authStyles.auth__title}>商家註冊</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<FormInput
					register={register}
					id='email'
					type='email'
					placeholder='請輸入 註冊Email'
					errors={emailErrors}
					errorKey={state.emailErrorKey}
					className={authStyles.auth__input}
					rules={{
						required: true,
						validate: (v) => {
							const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
							if (!pattern.test(v)) {
								dispatch({ type: 'email', status: 'pattern' });
								return false;
							}
							dispatch({ type: 'email', status: '' });
							return true;
						},
						onBlur: (event) => {
							if (event.target.value === '') {
								dispatch({ type: 'email', status: 'empty' });
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								dispatch({ type: 'email', status: '' });
							}
						},
					}}
				/>
				<FormInput
					register={register}
					id='name'
					placeholder='請輸入 商家名稱'
					className={authStyles.auth__input}
					errors={nameErrors}
					errorKey={state.nameErrorKey}
					rules={{
						required: true,
						validate: (value) => (value.length > 50 ? false : true),
						onBlur: (event) => {
							if (event.target.value === '') {
								dispatch({ type: 'name', status: 'empty' });
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								dispatch({ type: 'name', status: '' });
							}
							if (event.target.value.length > 50) {
								dispatch({ type: 'name', status: 'exceed' });
							}
						},
					}}
				/>
				<FormInput
					register={register}
					id='password'
					type='password'
					placeholder='請輸入 密碼'
					className={authStyles.auth__input}
					errors={passwordErrors}
					errorKey={state.passwordErrorKey}
					rules={{
						required: true,
						onBlur: (event) => {
							if (event.target.value === '') {
								dispatch({ type: 'password', status: 'empty' });
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								dispatch({ type: 'password', status: '' });
							}
						},
					}}
				/>
				<FormInput
					register={register}
					id='confirmedPassword'
					type='password'
					placeholder='請再次輸入 密碼'
					className={authStyles.auth__input}
					errors={confirmedPasswordErrors}
					errorKey={state.confirmedPasswordErrorKey}
					rules={{
						required: true,
						onBlur: (event) => {
							if (event.target.value === '') {
								dispatch({ type: 'confirmedPassword', status: 'empty' });
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								dispatch({ type: 'confirmedPassword', status: '' });
							}
						},
					}}
				/>
				<Button type='submit' disabled={!isValid} className={authStyles.auth__btn}>
					註冊
				</Button>
			</form>
			<div className={`${authStyles.auth__otherMethods} ${styles.otherMethods}`}>
				<Link to='/store/login'>
					<Button className={authStyles['auth__otherMethods--btn']}>登入</Button>
				</Link>
				<Link to='/signup'>
					<Button className={authStyles['auth__otherMethods--btn']}>用戶註冊頁</Button>
				</Link>
			</div>
		</>
	);
}
