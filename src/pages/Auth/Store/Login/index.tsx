import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useErrors } from '../../../../util';
import FormInput, { EmailInput } from '../../../../components/FormInput';
import authStyles from '../../styles.module.scss';
import styles from '../styles.module.scss';
import Button from '../../../../components/Button';

export default function StoreLoginPage() {
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm();
	const { errors, state, dispatch } = useErrors();

	return (
		<>
			<h1 className={authStyles.auth__title}>請先登入愛運動商家帳戶</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<EmailInput
					placeholder='請輸入Email'
					register={register}
					required={true}
					className={authStyles.auth__input}
				/>

				<FormInput
					placeholder='請輸入 密碼'
					register={register}
					id='password'
					type='password'
					errors={errors.password}
					errorKey={state.password}
					className={authStyles.auth__input}
					rules={{
						required: true,
						onBlur: (event) => {
							if (event.target.value === '') {
								dispatch({ type: 'password', status: 'empty' });
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								dispatch({ type: 'password', status: 'pass' });
							}
						},
					}}
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
