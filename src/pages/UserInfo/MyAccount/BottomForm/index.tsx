import { useForm } from 'react-hook-form';
import { useErrors, ActionType } from '../../../../util/useErrors';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import styles from '../styles.module.scss';

export default function BottomForm() {
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm();
	const { errors, state, dispatch } = useErrors({ password: '', confirmedPassword: '' });

	function handleInputEmpty(type: ActionType['type']) {
		return (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				dispatch({ type, status: 'empty' });
			}
		};
	}

	function handleInputIsNotEmpty(type: ActionType['type']) {
		return (event: React.ChangeEvent<HTMLInputElement>) => {
			const { target } = event;
			if (target.value !== '') {
				dispatch({ type, status: 'pass' });
			}
		};
	}

	return (
		<form onSubmit={handleSubmit((data) => console.log(data))} className={styles.form}>
			<FormInput
				type='password'
				label='請輸入密碼'
				id='password'
				errors={errors.password}
				errorKey={state.password}
				register={register}
				required={true}
				className={styles.form__input}
				onBlur={handleInputEmpty('password')}
				onChange={handleInputIsNotEmpty('password')}
			/>
			<FormInput
				type='password'
				register={register}
				label='請再次輸入密碼'
				id='confirmedPassword'
				className={styles.form__input}
				errors={errors.confirmedPassword}
				errorKey={state.confirmedPassword}
				required={true}
				onBlur={handleInputEmpty('confirmedPassword')}
				onChange={handleInputIsNotEmpty('confirmedPassword')}
			/>
			<Button type='submit' disabled={!isValid} className={styles.form__btn}>
				確認送出
			</Button>
		</form>
	);
}
