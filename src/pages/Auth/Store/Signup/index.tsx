import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import {
	EmailInput,
	NameInput,
	PasswordInput,
	ConfirmPasswordInput,
} from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import { storeSignup } from '../../../../api/auth';
import { useAuth } from '../../../../contexts/authContext';
import { isAxiosError } from '../../../../util/helpers.ts';
import authStyles from '../../styles.module.scss';
import styles from '../styles.module.scss';

export default function StoreSignupPage() {
	const {
		register,
		handleSubmit,
		formState: { isValid, errors },
		watch,
		setError,
		clearErrors,
	} = useForm();
	const [, setAuth] = useAuth();
	const navigate = useNavigate();
	const watchingPassword = watch('password');

	async function onSubmit(data: FieldValues) {
		try {
			const { email, password, confirmPassword, storeName } = data;
			if (password !== confirmPassword) {
				setError('confirmPassword', {
					type: 'different',
					message: '密碼不一致',
				});
				return;
			}
			const response = await storeSignup({ email, password, confirmPassword, storeName });
			if (response.status === 200) {
				const { userId, token } = response.data;
				localStorage.setItem('isport', JSON.stringify({ token, role: 'owner' }));
				setAuth({
					token,
					userId,
					avatar: '',
					isAuthenticated: true,
					role: 'owner',
					email,
					name: storeName,
				});
				navigate(`/store/find`);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError('email', {
					type: error.response?.data.status,
					message: error.response?.data.message,
				});
			} else {
				console.error(error);
			}
		}
	}

	return (
		<>
			<h1 className={authStyles.auth__title}>商家註冊</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<EmailInput
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					name='email'
					placeholder='請輸入註冊Email'
					className={authStyles.auth__input}
				/>
				<NameInput
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					name='storeName'
					placeholder='請輸入商家名稱'
					className={authStyles.auth__input}
				/>
				<PasswordInput
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請輸入密碼'
					name='password'
					className={authStyles.auth__input}
				/>
				<ConfirmPasswordInput
					watchingPassword={watchingPassword}
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請再次輸入確認密碼'
					name='confirmPassword'
					className={authStyles.auth__input}
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
