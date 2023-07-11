import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { BsGoogle, BsFacebook } from 'react-icons/bs';
import Button from '../../../components/Button';
import styles from '../styles.module.scss';
import FormInput from '../../../components/FormInput';

export default function LoginPage() {
	const {
		handleSubmit,
		register,
		// `isSubmitting` is for waiting data from server while user tries to log in.
		formState: { isValid, isSubmitting },
	} = useForm();
	const [emailErrorKey, setEmailErrorKey] = useState('');
	const [passwordErrorKey, setPasswordErrorKey] = useState('');
	console.log('🚀 ~ file: index.tsx:20 ~ LoginPage ~ isSubmitting:', isSubmitting);

	const passwordErrors = {
		empty: '密碼 不可為空',
	};
	const emailErrors = {
		empty: 'Email 不可為空',
		pattern: 'Email 格式不對',
	};

	return (
		<>
			<h1 className={styles.auth__title}>請先登入愛運動帳戶</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<FormInput
					register={register}
					id='email'
					placeholder='請輸入 Email'
					errors={emailErrors}
					errorKey={emailErrorKey}
					rules={{
						required: true,
						validate: {
							pattern: (v) => {
								const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
								if (!pattern.test(v)) {
									setEmailErrorKey('pattern');
									return false;
								}
								setEmailErrorKey('');
								return true;
							},
						},
						onBlur: (event) => {
							const { target } = event;
							if (target.value === '') {
								setEmailErrorKey('empty');
							}
						},
						onChange: (event) => {
							const { target } = event;
							if (target.value !== '') {
								setEmailErrorKey('');
							}
						},
					}}
					className={styles.auth__input}
				></FormInput>

				<FormInput
					type='password'
					placeholder='請輸入 密碼'
					id='password'
					errors={passwordErrors}
					errorKey={passwordErrorKey}
					register={register}
					rules={{
						required: true,
						onBlur: (event) => {
							const { target } = event;
							if (target.value === '') {
								setPasswordErrorKey('empty');
							}
						},
						onChange: (event) => {
							const { target } = event;
							if (target.value !== '') {
								setPasswordErrorKey('pass');
							}
						},
					}}
					className={styles.auth__input}
				/>
				<Button type='submit' disabled={!isValid} className={styles.auth__btn}>
					登入
				</Button>
			</form>
			<div className={styles.auth__otherMethods}>
				<Link to='/signup'>
					<Button className={styles['auth__otherMethods--btn']}>註冊</Button>
				</Link>
				<Link to='/store/login'>
					<Button className={styles['auth__otherMethods--btn']}>商家登入頁</Button>
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
