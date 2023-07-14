import { useForm } from 'react-hook-form';
import AvatarInput from '../../../../components/AvatarInput';
import FormInput, { EmailInput } from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import styles from '../styles.module.scss';

export default function UpperForm() {
	const {
		register,
		handleSubmit,
		formState: { isValid, errors },
		watch,
		resetField,
		setError,
		clearErrors,
	} = useForm();
	const userEmail = watch('email', 'user1@example.com');
	const userName = watch('name', 'user1');

	return (
		<form onSubmit={handleSubmit((data) => console.log(data))} className={styles.form}>
			<AvatarInput
				register={register}
				watch={watch}
				resetField={resetField}
				className={styles.form__input}
			/>
			<EmailInput
				register={register}
				type='email'
				errors={errors}
				value={userEmail}
				label='Email'
				className={styles.form__input}
				name='email'
				setError={setError}
				clearErrors={clearErrors}
			/>
			<FormInput
				register={register}
				errors={errors}
				value={userName}
				label='暱稱'
				name='name'
				className={styles.form__input}
				rules={{
					maxLength: 50,
					onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
						const { target } = event;
						if (target.value.length > 50) {
							setError('name', { type: 'maxLength', message: '暱稱不能大於50個字' });
						} else {
							clearErrors('name');
						}
					},
				}}
			/>
			<Button type='submit' disabled={!isValid} className={styles.form__btn}>
				確認送出
			</Button>
		</form>
	);
}
