import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormInput from '../../../../components/FormInput';
import authStyles from '../../styles.module.scss';
import styles from './styles.module.scss';
import Button from '../../../../components/Button';

export default function StoreLoginPage() {
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm();
	const [emailErrorKey, setEmailErrorKey] = useState('');
	const [passwordErrorKey, setPasswordErrorKey] = useState('');

	const emailErrors = {
		empty: 'Email 不可為空',
		notExist: 'Email 不存在',
		pattern: 'Email 格式不對',
	};

	const passwordErrors = {
		empty: '密碼 不可為空',
		error: '密碼 錯誤',
	};

	return (
		<>
			<h1 className={authStyles.auth__title}>請先登入愛運動商家帳戶</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<FormInput
					placeholder='請輸入 Email'
					register={register}
					id='email'
					type='email'
					className={authStyles.auth__input}
					errors={emailErrors}
					errorKey={emailErrorKey}
					rules={{
						required: true,
						validate: (v) => {
							const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
							if (!pattern.test(v)) {
								setEmailErrorKey('pattern');
								return false;
							}
							setEmailErrorKey('');
							return true;
						},
						onBlur: (event) => {
							if (event.target.value === '') {
								setEmailErrorKey('empty');
							} else {
								setEmailErrorKey('');
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								setEmailErrorKey('');
							}
						},
					}}
				/>
				<FormInput
					placeholder='請輸入 密碼'
					register={register}
					id='password'
					type='password'
					errors={passwordErrors}
					errorKey={passwordErrorKey}
					className={authStyles.auth__input}
					rules={{
						required: true,
						onBlur: (event) => {
							if (event.target.value === '') {
								setPasswordErrorKey('empty');
							} else {
								setPasswordErrorKey('');
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								setPasswordErrorKey('');
							}
						},
					}}
				/>
				<Button type='submit' disabled={!isValid} className={authStyles.auth__btn}>
					登入
				</Button>
			</form>
			<div className={`${styles.otherMethods} ${authStyles.auth__otherMethods}`}>
				<Link to='/store/signup'>
					<Button className={authStyles['auth__otherMethods--btn']}>註冊</Button>
				</Link>
				<Link to='/login'>
					<Button className={authStyles['auth__otherMethods--btn']}>用戶登入頁</Button>
				</Link>
			</div>
		</>
	);
}
