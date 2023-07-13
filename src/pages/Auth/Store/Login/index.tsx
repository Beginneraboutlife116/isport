import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useErrors, ActionType } from '../../../../util/useErrors';
import FormInput from '../../../../components/FormInput';
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

	function handleBlur(type: ActionType['type']) {
		return (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				dispatch({ type, status: 'empty' });
			}
		};
	}

	function handleChange(type: ActionType['type']) {
		return (event: React.ChangeEvent<HTMLInputElement>) => {
			const { target } = event;
			if (target.value !== '') {
				dispatch({ type, status: 'pass' });
			}
		};
	}

	return (
		<>
			<h1 className={authStyles.auth__title}>請先登入愛運動商家帳戶</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<FormInput
					placeholder='請輸入Email'
					id='email'
					type='email'
					errors={errors.email}
					errorKey={state.email}
					register={register}
					required={true}
					validate={{
						pattern: (v) => {
							const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
							if (!pattern.test(v)) {
								dispatch({ type: 'email', status: 'pattern' });
								return false;
							}
							dispatch({ type: 'email', status: 'pass' });
							return true;
						},
					}}
					onBlur={handleBlur('email')}
					onChange={handleChange('email')}
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
					required={true}
					onBlur={handleBlur('password')}
					onChange={handleChange('password')}
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