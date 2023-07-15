import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import FormInput, {
	EmailInput,
	PasswordInput,
	ConfirmPasswordInput,
} from '../../../../components/FormInput';
import Button from '../../../../components/Button';
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

	const watchingPassword = watch('password');

	return (
		<>
			<h1 className={authStyles.auth__title}>商家註冊</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<EmailInput
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					name='email'
					placeholder='請輸入註冊Email'
					className={authStyles.auth__input}
				/>
				<FormInput
					register={register}
					errors={errors}
					name='name'
					placeholder='請輸入商家名稱'
					className={authStyles.auth__input}
					rules={{
						required: true,
						maxLength: 50,
						onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => {
							if (event.target.value === '') {
								setError('name', { type: 'required', message: '商家名稱不可為空' });
							}
						},
						onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							if (target.value.length > 50) {
								setError('name', { type: 'maxLength', message: '商家名稱不能大於50個字' });
							} else {
								clearErrors('name');
							}
						},
					}}
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
					name='confirmedPassword'
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
