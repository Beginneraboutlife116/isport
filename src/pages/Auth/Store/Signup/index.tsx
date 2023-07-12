import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useErrors, ActionType } from '../../../../util/useErrors';
import FormInput from '../../../../components/FormInput';
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
			<h1 className={authStyles.auth__title}>商家註冊</h1>
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
					register={register}
					id='name'
					placeholder='請輸入 商家名稱'
					className={authStyles.auth__input}
					errors={errors.name}
					errorKey={state.name}
					required={true}
					validate={(value) => (value.length > 50 ? false : true)}
					onBlur={handleBlur('name')}
					onChange={(event) => {
						if (event.target.value !== '') {
							dispatch({ type: 'name', status: 'pass' });
						}
						if (event.target.value.length > 50) {
							dispatch({ type: 'name', status: 'storeExceed' });
						}
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
					required={true}
					onBlur={handleBlur('password')}
					onChange={handleChange('password')}
				/>
				<FormInput
					register={register}
					id='confirmedPassword'
					type='password'
					placeholder='請再次輸入 密碼'
					className={authStyles.auth__input}
					errors={errors.confirmedPassword}
					errorKey={state.confirmedPassword}
					required={true}
					onBlur={handleBlur('confirmedPassword')}
					onChange={handleChange('confirmedPassword')}
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
