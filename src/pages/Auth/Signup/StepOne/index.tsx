import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BsGoogle, BsFacebook } from 'react-icons/bs';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import styles from '../../styles.module.scss';

export default function SignupStepOnePage() {
	const {
		register,
		handleSubmit,
		formState: { isValid, isSubmitting },
	} = useForm();
	const [emailErrorKey, setEmailErrorKey] = useState('');
	const [passwordErrorKey, setPasswordErrorKey] = useState('');
	const [confirmedPasswordErrorKey, setConfirmedPasswordErrorKey] = useState('');
	console.log('🚀 ~ file: index.tsx:20 ~ LoginPage ~ isSubmitting:', isSubmitting);

	const passwordErrors = {
		empty: '密碼 不可為空',
	};
	const emailErrors = {
		empty: 'Email 不可為空',
		pattern: 'Email 格式不對',
		overlap: 'Email 已被註冊過',
	};
	const confirmedPasswordErrors = {
		empty: '確認密碼 不可為空',
		different: '密碼 與 確認密碼 不一致',
	};

	return (
		<>
			<h1 className={styles.auth__title}>用戶註冊 Step 1</h1>
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
				<FormInput
					type='password'
					placeholder='請再次輸入 密碼'
					id='confirmedPassword'
					errors={confirmedPasswordErrors}
					errorKey={confirmedPasswordErrorKey}
					register={register}
					rules={{
						required: true,
						onBlur: (event) => {
							const { target } = event;
							if (target.value === '') {
								setConfirmedPasswordErrorKey('empty');
							}
						},
						onChange: (event) => {
							const { target } = event;
							if (target.value !== '') {
								setConfirmedPasswordErrorKey('pass');
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
