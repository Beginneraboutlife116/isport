import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { IconContext } from 'react-icons';
import { BsGoogle, BsFacebook } from 'react-icons/bs';
import Button from '../../components/Button';
import styles from './styles.module.scss';
import Input from '../../components/FormInput';

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
		<main className={styles.login}>
			<h1 className={styles.login__title}>請先登入愛運動帳戶</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<Input
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
					className={styles.login__input}
				></Input>

				<Input
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
					className={styles.login__input}
				/>
				<Button type='submit' disabled={!isValid} className={styles.login__btn}>
					登入
				</Button>
			</form>
			<div className={styles.login__other_methods}>
				<Link to='/signup'>
					<Button data-switch>註冊</Button>
				</Link>
				<Link to='/store/login'>
					<Button data-switch>商家登入頁</Button>
				</Link>
			</div>
			<div className={styles.login__icon_wrapper}>
				<Button>
					<IconContext.Provider value={{ color: '#D3455B', className: styles.login__icon }}>
						<BsGoogle />
					</IconContext.Provider>
				</Button>
				<Button>
					<IconContext.Provider value={{ color: '#3488D9', className: styles.login__icon }}>
						<BsFacebook />
					</IconContext.Provider>
				</Button>
			</div>
		</main>
	);
}
