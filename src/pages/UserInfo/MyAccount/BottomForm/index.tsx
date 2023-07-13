import { useForm } from 'react-hook-form';
import { PasswordInput, ConfirmPasswordInput } from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import styles from '../styles.module.scss';

export default function BottomForm() {
	const {
		register,
		handleSubmit,
		formState: { isValid, errors },
		setError,
		clearErrors,
		watch,
	} = useForm();

	const watchingPassword = watch('password');

	return (
		<form onSubmit={handleSubmit((data) => console.log(data))} className={styles.form}>
			<PasswordInput
				type='password'
				label='請輸入密碼'
				name='password'
				errors={errors}
				register={register}
				className={styles.form__input}
				setError={setError}
				clearErrors={clearErrors}
			/>
			<ConfirmPasswordInput
				type='password'
				label='請再次輸入密碼'
				name='confirmedPassword'
				errors={errors}
				register={register}
				className={styles.form__input}
				setError={setError}
				clearErrors={clearErrors}
				watchingPassword={watchingPassword}
			/>
			<Button type='submit' disabled={!isValid} className={styles.form__btn}>
				確認送出
			</Button>
		</form>
	);
}
