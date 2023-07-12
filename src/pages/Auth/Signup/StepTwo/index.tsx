import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useErrors } from '../../../../util/useErrors';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import authStyles from '../../styles.module.scss';
import styles from './styles.module.scss';
import AvatarInput from '../../../../components/AvatarInput';

export default function SignupStepTwoPage() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { isValid },
		resetField,
	} = useForm();
	const { errors, state, dispatch } = useErrors({ name: '', avatar: '' });

	return (
		<>
			<h1 className={authStyles.auth__title}>用戶註冊 Step 2</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<AvatarInput
					dispatch={dispatch}
					errors={errors.avatar}
					errorKey={state.avatar}
					register={register}
					watch={watch}
					className={authStyles.auth__input}
					onReset={resetField}
				/>
				<FormInput
					register={register}
					placeholder='請輸入 暱稱'
					errors={errors.name}
					errorKey={state.name}
					id='name'
					className={authStyles.auth__input}
					required={false}
					validate={(value) => {
						if (value.length > 50) {
							dispatch({ type: 'name', status: 'userExceed' });
							return false;
						} else {
							dispatch({ type: 'name', status: 'pass' });
							return true;
						}
					}}
				/>
				<Button type='submit' disabled={!isValid} className={authStyles.auth__btn}>
					送出
				</Button>
			</form>
			<Link to='/find'>
				<Button className={styles.skip}>skip</Button>
			</Link>
		</>
	);
}
