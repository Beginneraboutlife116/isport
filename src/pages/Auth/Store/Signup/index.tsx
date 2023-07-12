import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useErrors } from '../../../../util';
import FormInput, { EmailInput } from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import authStyles from '../../styles.module.scss';
import styles from '../styles.module.scss';

export default function StoreSignupPage() {
	const { errors, state, dispatch } = useErrors();
	const {
		register,
		handleSubmit,
		formState: { isValid },
	} = useForm();

	return (
		<>
			<h1 className={authStyles.auth__title}>商家註冊</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<EmailInput
					placeholder='請輸入Email'
					register={register}
					required={true}
					className={authStyles.auth__input}
				/>

				<FormInput
					register={register}
					id='name'
					placeholder='請輸入 商家名稱'
					className={authStyles.auth__input}
					errors={errors.name}
					errorKey={state.name}
					rules={{
						required: true,
						validate: (value) => (value.length > 50 ? false : true),
						onBlur: (event) => {
							if (event.target.value === '') {
								dispatch({ type: 'name', status: 'empty' });
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								dispatch({ type: 'name', status: 'pass' });
							}
							if (event.target.value.length > 50) {
								dispatch({ type: 'name', status: 'storeExceed' });
							}
						},
					}}
				/>
				<FormInput
					register={register}
					id='password'
					type='password'
					placeholder='請輸入 密碼'
					className={authStyles.auth__input}
					errors={errors.password}
					errorKey={state.password}
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
				<FormInput
					register={register}
					id='confirmedPassword'
					type='password'
					placeholder='請再次輸入 密碼'
					className={authStyles.auth__input}
					errors={errors.confirmedPassword}
					errorKey={state.confirmedPassword}
					rules={{
						required: true,
						onBlur: (event) => {
							if (event.target.value === '') {
								dispatch({ type: 'confirmedPassword', status: 'empty' });
							}
						},
						onChange: (event) => {
							if (event.target.value !== '') {
								dispatch({ type: 'confirmedPassword', status: 'pass' });
							}
						},
					}}
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
