import { Link, useNavigate } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { BsGoogle, BsFacebook } from 'react-icons/bs';
import { EmailInput, PasswordInput, ConfirmPasswordInput } from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import { signup } from '../../../../api/auth';
import { useAuth } from '../../../../contexts/authContext';
import { isAxiosError } from '../../../../util/helpers.ts';
import styles from '../../styles.module.scss';

export default function SignupStepOnePage() {
	const {
		register,
		handleSubmit,
		formState: { isValid, isSubmitting, errors },
		setError,
		clearErrors,
		watch,
	} = useForm();
	const navigate = useNavigate();
	const [, setAuth] = useAuth();

	const watchingPassword = watch('password');

	async function onSubmit(data: FieldValues) {
		try {
			const { email, password, confirmPassword } = data;
			if (password !== confirmPassword) {
				setError('confirmPassword', {
					type: 'different',
					message: '密碼不一致',
				});
				return;
			}
			const response = await signup({ email, password, confirmPassword });
			if (response.status === 200) {
				const { token, userId, role } = response.data;
				localStorage.setItem('isport', JSON.stringify({ token, role }));
				setAuth({ token, role, userId, email, isAuthenticated: true, avatar: '', name: '匿名' });
				navigate(`/signup/${userId}`);
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
			<h1 className={styles.auth__title}>用戶註冊 Step 1</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<EmailInput
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					name='email'
					placeholder='請輸入註冊Email'
					className={styles.auth__input}
				/>
				<PasswordInput
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請輸入密碼'
					name='password'
					className={styles.auth__input}
				/>
				<ConfirmPasswordInput
					watchingPassword={watchingPassword}
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請再次輸入確認密碼'
					name='confirmPassword'
					className={styles.auth__input}
				/>
				<Button type='submit' disabled={!isValid} className={styles.auth__btn}>
					註冊
				</Button>
			</form>
			<div className={styles.auth__otherMethods}>
				<Link to='/login'>
					<Button className={styles['auth__otherMethods--btn']}>登入</Button>
				</Link>
				<Link to='/store/signup'>
					<Button className={styles['auth__otherMethods--btn']}>商家註冊頁</Button>
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
