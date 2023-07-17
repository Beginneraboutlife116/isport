import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import { useAuth } from '../../../../contexts/authContext';
import authStyles from '../../styles.module.scss';
import styles from './styles.module.scss';
import AvatarInput from '../../../../components/AvatarInput';
import { updateUserAccount } from '../../../../api/user';
import { isAxiosError } from '../../../../util/helpers';

export default function SignupStepTwoPage() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { isValid, errors, isSubmitting },
		resetField,
		setError,
		clearErrors,
	} = useForm();
	const [auth, setAuth] = useAuth();
	const [isAvatarChanged, setIsAvatarChanged] = useState<boolean>(false);
	const navigate = useNavigate();

	async function onSubmit(data: FieldValues) {
		try {
			const { name, avatar } = data;
			let fakeAvatar = '';
			if (name !== auth.name || isAvatarChanged) {
				const formData = new FormData();
				formData.append('nickname', name);
				formData.append('email', auth.email);
				if (isAvatarChanged) {
					const file = avatar ? avatar[0] : null;
					fakeAvatar = file ? URL.createObjectURL(file) : '';
					formData.append('avatar', file);
				}
				const response = await updateUserAccount(formData);
				if (response.status === 200) {
					setAuth({ ...auth, name, avatar: fakeAvatar });
					navigate('/find');
				}
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError('name', {
					type: error.response?.data.status,
					message: error.response?.data.message,
				});
			} else {
				console.error(error);
			}
		}
	}

	return (
		<>
			<h1 className={authStyles.auth__title}>用戶註冊 Step 2</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<AvatarInput
					register={register}
					watch={watch}
					className={authStyles.auth__input}
					resetField={resetField}
					changeIsAvatarChanged={setIsAvatarChanged}
				/>
				<FormInput
					register={register}
					errors={errors}
					name='name'
					placeholder='請輸入暱稱'
					className={authStyles.auth__input}
					rules={{
						maxLength: 50,
						onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							if (target.value.length > 50) {
								setError('name', { type: 'maxLength', message: '暱稱不能大於50個字' });
							} else {
								clearErrors('name');
							}
						},
					}}
				/>
				<Button type='submit' disabled={!isValid || isSubmitting} className={authStyles.auth__btn}>
					{isSubmitting ? '發送中...' : '確認送出'}
				</Button>
			</form>
			<Link to='/find'>
				<Button className={styles.skip}>skip</Button>
			</Link>
		</>
	);
}
