import { FieldValues, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { EmailInput, PasswordInput } from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import { storeLogin } from '../../../../api/auth';
import { useAuth } from '../../../../contexts/authContext';
import { isAxiosError } from '../../../../util/helpers.ts';
import authStyles from '../../styles.module.scss';
import styles from '../styles.module.scss';

export default function StoreLoginPage() {
	const {
		register,
		handleSubmit,
		formState: { isValid, errors, isSubmitting },
		setError,
		clearErrors,
	} = useForm();
	const navigate = useNavigate();
	const [, setAuth] = useAuth();

	async function onSubmit(data: FieldValues) {
		try {
			const { email, password } = data;
			const response = await storeLogin({ email, password });
			if (response.status === 200) {
				const { token, userId, role } = response.data;
				localStorage.setItem('isport', JSON.stringify({ token, role }));
				setAuth({ token, userId, role, isAuthenticated: true, avatar: '', email: '', name: '' });
				navigate(`/store/find`);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.data.status === 'error') {
					setError('email', {
						type: error.response?.data.status,
						message: '非正確商家登入，請再檢查權限，或聯絡管理者',
					});
				} else {
					const whichInputError = error.response?.data.message.includes('密碼')
						? 'password'
						: 'email';
					setError(whichInputError, {
						type: error.response?.data.status,
						message: error.response?.data.message,
					});
				}
			} else {
				console.error(error);
			}
		}
	}

	return (
		<>
			<h1 className={authStyles.auth__title}>請先登入愛運動商家帳戶</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<EmailInput
					register={register}
					errorMessage={(errors['email']?.message ?? '') as string}
					placeholder='請輸入Email'
					setError={setError}
					clearErrors={clearErrors}
					className={authStyles.auth__input}
				/>
				<PasswordInput
					setError={setError}
					errorMessage={(errors['password']?.message ?? '') as string}
					clearErrors={clearErrors}
					placeholder='請輸入密碼'
					register={register}
					className={authStyles.auth__input}
				/>
				<Button type='submit' disabled={!isValid || isSubmitting} className={authStyles.auth__btn}>
					{isSubmitting ? '登入中...' : '登入'}
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
