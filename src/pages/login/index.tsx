import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { IconContext } from 'react-icons';
import { BsGoogle, BsFacebook } from 'react-icons/bs';
import Button from '../../components/Button';
import styles from './styles.module.scss';

type LoginFormProps = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const {
		handleSubmit,
		register,
		// `isSubmitting` is for waiting data from server while user tries to log in.
		formState: { isValid, isSubmitting },
	} = useForm<LoginFormProps>({
		defaultValues: { email: '', password: '' },
	});
	const [emailError, setEmailError] = useState('pass');
	const [passwordError, setPasswordError] = useState('pass');
	console.log('🚀 ~ file: index.tsx:20 ~ LoginPage ~ isSubmitting:', isSubmitting);

	return (
		<main className={styles.login}>
			<h1 className={styles.login__title}>請先登入愛運動帳戶</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<div className={styles.input}>
					<input
						type='email'
						placeholder='請輸入 Email'
						{...register('email', {
							required: true,
							validate: {
								pattern: (v) => {
									const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
									if (!pattern.test(v)) {
										setEmailError('email pattern incorrect');
										return false;
									}
									return true;
								},
							},
							// 可以整合成 component
							onBlur: ({ target }) => {
								if (target.value === '') {
									setEmailError('email empty');
								}
							},
							onChange: ({ target }) => {
								if (target.value !== '') {
									setEmailError('pass');
								}
							},
						})}
					/>
					{emailError === 'email empty' && <p className={styles.input__error}>Email 不可為空</p>}
					{emailError === 'email pattern incorrect' && (
						<p className={styles.input__error}>Email 格式不對</p>
					)}
				</div>

				<div className={styles.input}>
					<input
						type='password'
						placeholder='請輸入 密碼'
						{...register('password', {
							required: true,
							onBlur: ({ target }) => {
								if (target.value === '') {
									setPasswordError('password empty');
								}
							},
							onChange: ({ target }) => {
								if (target.value !== '') {
									setPasswordError('pass');
								}
							},
						})}
					/>
					{passwordError === 'password empty' && (
						<p className={styles.input__error}>密碼 不可為空</p>
					)}
				</div>
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
