import { Link, useNavigate } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';
import { BsGoogle, BsFacebook } from 'react-icons/bs';
import Button from '../../../components/Button';
import styles from '../styles.module.scss';
import { EmailInput, PasswordInput } from '../../../components/FormInput';
import { login } from '../../../api/auth';
import { useAuth } from '../../../contexts/authContext';
import { isAxiosError } from '../../../util/helpers.ts';

export default function LoginPage() {
	const [, setAuth] = useAuth();
	const navigate = useNavigate();
	const {
		handleSubmit,
		register,
		// `isSubmitting` is for waiting data from server while user tries to log in.
		formState: { isValid, isSubmitting, errors },
		setError,
		clearErrors,
	} = useForm();

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
				const whichInputError = error.response?.data.message.includes('密碼')
					? 'password'
					: 'email';
				setError(whichInputError, {
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
			<h1 className={styles.auth__title}>請先登入愛運動帳戶</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<EmailInput
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					name='email'
					placeholder='請輸入Email'
					className={styles.auth__input}
				/>
				<PasswordInput
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請輸入密碼'
					className={styles.auth__input}
					name={'password'}
				/>
				<Button type='submit' disabled={!isValid} className={styles.auth__btn}>
					登入
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
				<Button>
					<BsGoogle className={`${styles['auth__icon--google']} ${styles.auth__icon}`} />
				</Button>
				<Button>
					<BsFacebook className={`${styles['auth__icon--facebook']} ${styles.auth__icon}`} />
				</Button>
			</div>
		</>
	);
}
