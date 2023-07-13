import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { EmailInput, PasswordInput } from '../../../../components/FormInput';
import authStyles from '../../styles.module.scss';
import styles from '../styles.module.scss';
import Button from '../../../../components/Button';

export default function StoreLoginPage() {
	const {
		register,
		handleSubmit,
		formState: { isValid, errors },
		setError,
		clearErrors,
	} = useForm();

	return (
		<>
			<h1 className={authStyles.auth__title}>請先登入愛運動商家帳戶</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<EmailInput
					register={register}
					errors={errors}
					placeholder='請輸入Email'
					type='email'
					name='email'
					setError={setError}
					clearErrors={clearErrors}
					className={authStyles.auth__input}
				/>
				<PasswordInput
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請輸入密碼'
					register={register}
					name='password'
					type='password'
					errors={errors}
					className={authStyles.auth__input}
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
