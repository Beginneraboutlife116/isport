import { useForm } from 'react-hook-form';
import { useErrors } from '../../../../util/useErrors';
import AvatarInput from '../../../../components/AvatarInput';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import styles from '../styles.module.scss';

export default function UpperForm() {
	const {
		register,
		handleSubmit,
		formState: { isValid },
		watch,
		resetField,
	} = useForm();
	const { errors, state, dispatch } = useErrors({ email: '', name: '', avatar: '' });
	const userEmail = watch('email', 'user1@example.com');
	const userName = watch('name', 'user1');

	return (
		<form onSubmit={handleSubmit((data) => console.log(data))} className={styles.form}>
			<AvatarInput
				register={register}
				watch={watch}
				onReset={resetField}
				errors={errors.avatar}
				errorKey={state.avatar}
				dispatch={dispatch}
				className={styles.form__input}
			/>
			<FormInput
				register={register}
				type='email'
				errors={errors.email}
				errorKey={state.email}
				value={userEmail}
				required={true}
				label='Email'
				id='email'
				className={styles.form__input}
				validate={(v) => {
					const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
					if (!pattern.test(v)) {
						dispatch({ type: 'email', status: 'pattern' });
						return false;
					}
					dispatch({ type: 'email', status: 'pass' });
					return true;
				}}
				onBlur={(event) => {
					const { target } = event;
					if (target.value === '') {
						dispatch({ type: 'email', status: 'empty' });
					}
				}}
				onChange={(event) => {
					const { target } = event;
					if (target.value !== '') {
						dispatch({ type: 'email', status: 'pass' });
					}
				}}
			/>
			<FormInput
				register={register}
				errors={errors.name}
				errorKey={state.name}
				value={userName}
				required={false}
				label='暱稱'
				id='name'
				className={styles.form__input}
			/>
			<Button type='submit' disabled={!isValid} className={styles.form__btn}>
				確認送出
			</Button>
		</form>
	);
}
