import { LegacyRef, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';
import { BsFacebook } from 'react-icons/bs';
import Button from '../../../components/Button';
import styles from '../styles.module.scss';
import { EmailInput, PasswordInput } from '../../../components/FormInput';
import { login } from '../../../api/auth';
import { useAuth } from '../../../contexts/authContext';
import { isAxiosError } from '../../../util/helpers.ts';


export default function LoginPage() {
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	const buttonRef = useRef<HTMLElement>();
	const [, setAuth] = useAuth();
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		formState: { isValid, isSubmitting, errors },
		setError,
		clearErrors,
	} = useForm();

	useEffect(() => {
		const button = buttonRef.current;
		if (button) {
			google.accounts.id.initialize({
				client_id: googleClientId,
				callback: handleCredentialResponse,
			});

			google.accounts.id.renderButton(button, {
				type: 'standard',
				theme: 'outline',
				size: 'large',
			});

			google.accounts.id.prompt();
		}
		function handleCredentialResponse(response: google.accounts.id.CredentialResponse) {
			console.log('Encoded JWT ID token: ' + response.credential);
		}
	}, []);

	async function onSubmit(data: FieldValues) {
		try {
			const { email, password } = data;
			const response = await login({ email, password });
			if (response.status === 200) {
				const { token, avatar, role, userId } = response.data;
				localStorage.setItem('isport', JSON.stringify({ token, role }));
				setAuth({ token, role, userId, avatar, isAuthenticated: true, email: '', name: '' });
				navigate('/find');
			}
		} catch (error) {
			if (isAxiosError(error)) {
				if (error.response?.data.status === 'error') {
					setError('email', {
						type: error.response?.data.status,
						message: '非正確使用者登入，請再檢查權限，或聯絡管理者',
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
			<h1 className={styles.auth__title}>請先登入愛運動帳戶</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<EmailInput
					register={register}
					errorMessage={(errors['email']?.message ?? '') as string}
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請輸入Email'
					className={styles.auth__input}
				/>
				<PasswordInput
					register={register}
					errorMessage={(errors['password']?.message ?? '') as string}
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請輸入密碼'
					className={styles.auth__input}
				/>
				<Button type='submit' disabled={!isValid || isSubmitting} className={styles.auth__btn}>
					{isSubmitting ? '登入中...' : '登入'}
				</Button>
			</form>
			<div className={styles.auth__otherMethods}>
				<Link to='/signup'>
					<Button className={styles['auth__otherMethods--btn']}>註冊</Button>
				</Link>
				<Link to='/store/login'>
					<Button className={styles['auth__otherMethods--btn']}>商家登入頁</Button>
				</Link>
			</div>
			<div className={styles.auth__iconWrapper}>
				<button
					aria-label='google sign in'
					ref={buttonRef as LegacyRef<HTMLButtonElement>}
					className={styles.auth__google}
				/>
				<Button>
					<BsFacebook className={`${styles['auth__icon--facebook']} ${styles.auth__icon}`} />
				</Button>
			</div>
		</>
	);
}
