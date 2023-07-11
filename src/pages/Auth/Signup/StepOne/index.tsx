import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BsGoogle, BsFacebook } from 'react-icons/bs';
import { useErrors } from '../../../../util';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import styles from '../../styles.module.scss';

export default function SignupStepOnePage() {
	const {
		register,
		handleSubmit,
		formState: { isValid, isSubmitting },
	} = useForm();
	const { errors, state, dispatch } = useErrors({ email: '', password: '', confirmedPassword: '' });
	console.log('🚀 ~ file: index.tsx:20 ~ LoginPage ~ isSubmitting:', isSubmitting);

	return (
		<>
			<h1 className={styles.auth__title}>用戶註冊 Step 1</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<FormInput
					register={register}
					id='email'
					placeholder='請輸入 Email'
					errors={errors.email}
					errorKey={state.email}
					rules={{
						required: true,
						validate: {
							pattern: (v) => {
								const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
								if (!pattern.test(v)) {
									dispatch({ type: 'email', status: 'pattern' });
									return false;
								}
								dispatch({ type: 'email', status: 'pass' });
								return true;
							},
						},
						onBlur: (event) => {
							const { target } = event;
							if (target.value === '') {
								dispatch({ type: 'email', status: 'empty' });
							}
						},
						onChange: (event) => {
							const { target } = event;
							if (target.value !== '') {
								dispatch({ type: 'email', status: 'pass' });
							}
						},
					}}
					className={styles.auth__input}
				></FormInput>

				<FormInput
					type='password'
					placeholder='請輸入 密碼'
					id='password'
					errors={errors.password}
					errorKey={state.password}
					register={register}
					rules={{
						required: true,
						onBlur: (event) => {
							const { target } = event;
							if (target.value === '') {
								dispatch({ type: 'password', status: 'empty' });
							}
						},
						onChange: (event) => {
							const { target } = event;
							if (target.value !== '') {
								dispatch({ type: 'password', status: 'pass' });
							}
						},
					}}
					className={styles.auth__input}
				/>
				<FormInput
					type='password'
					placeholder='請再次輸入 密碼'
					id='confirmedPassword'
					errors={errors.confirmedPassword}
					errorKey={state.confirmedPassword}
					register={register}
					rules={{
						required: true,
						onBlur: (event) => {
							const { target } = event;
							if (target.value === '') {
								dispatch({ type: 'confirmedPassword', status: 'empty' });
							}
						},
						onChange: (event) => {
							const { target } = event;
							if (target.value !== '') {
								dispatch({ type: 'confirmedPassword', status: 'pass' });
							}
						},
					}}
					className={styles.auth__input}
				/>
				<Button type='submit' disabled={!isValid} className={styles.auth__btn}>
					註冊
				</Button>
			</form>
			<div className={styles.auth__otherMethods}>
				<Link to='/login'>
					<Button className={styles['auth__otherMethods--btn']}>登入</Button>
				</Link>
				<Link to='/store/signup'>
					<Button className={styles['auth__otherMethods--btn']}>商家註冊頁</Button>
				</Link>
			</div>
			<div className={styles.auth__iconWrapper}>
				<Button>
					<BsGoogle className={`${styles['auth__icon--google']} ${styles.auth__icon}`} />
				</Button>
				<Button>
					<BsFacebook className={`${styles['auth__icon--facebook']} ${styles.auth__icon}`} />
				</Button>
			</div>
		</>
	);
}
