import { FieldValues, useForm } from 'react-hook-form';
import { PasswordInput, ConfirmPasswordInput } from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import { updateUserPassword } from '../../../../api/user';
import { isAxiosError } from 'axios';
import styles from '../styles.module.scss';

export default function BottomForm() {
	const {
		register,
		handleSubmit,
		formState: { isValid, errors, isSubmitting },
		setError,
		clearErrors,
		watch,
		reset,
	} = useForm();

	const watchingPassword = watch('password');

	async function onSubmit(data: FieldValues) {
		try {
			const { password, confirmPassword } = data;
			if (password !== confirmPassword) {
				setError('confirmPassword', {
					type: 'different',
					message: '密碼不一致',
				});
				return;
			}
			const response = await updateUserPassword({ password, confirmPassword });
			if (response.status === 200) {
				reset();
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError('confirmPassword', {
					type: error.response?.data.status,
					message: error.response?.data.message,
				});
			} else {
				console.error(error);
			}
		}
	}

	const passwordError = errors['password']?.message || '';
	const confirmPasswordError = errors['confirmPassword']?.message || '';

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
			<PasswordInput
				type='password'
				label='請輸入密碼'
				errorMessage={passwordError as string}
				register={register}
				className={styles.form__input}
				setError={setError}
				clearErrors={clearErrors}
			/>
			<ConfirmPasswordInput
				label='請再次輸入密碼'
				errorMessage={confirmPasswordError as string}
				register={register}
				className={styles.form__input}
				setError={setError}
				clearErrors={clearErrors}
				watchingPassword={watchingPassword}
			/>
			<Button type='submit' disabled={!isValid || isSubmitting} className={styles.form__btn}>
				{isSubmitting ? '送出中...' : '確認送出'}
			</Button>
		</form>
	);
}
