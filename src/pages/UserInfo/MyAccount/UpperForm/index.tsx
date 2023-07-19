import { useState, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import AvatarInput from '../../../../components/AvatarInput';
import { EmailInput, NameInput } from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import { useAuth } from '../../../../contexts/authContext';
import { getUserData, updateUserAccount } from '../../../../api/user';
import { isAxiosError } from '../../../../util/helpers';
import styles from '../styles.module.scss';

export default function UpperForm() {
	const [auth, setAuth] = useAuth();
	const {
		register,
		handleSubmit,
		formState: { isValid, errors, isSubmitting },
		watch,
		resetField,
		setError,
		clearErrors,
	} = useForm<FieldValues>({ values: { email: auth.email, nickname: auth.name, avatar: null } });
	const [isAvatarChanged, setIsAvatarChanged] = useState<boolean>(false);

	useEffect(() => {
		async function fetchUserData() {
			try {
				const response = await getUserData();
				if (response.status === 200) {
					setAuth((a) => ({ ...a, email: response.data.email, name: response.data.nickname }));
				}
			} catch (error) {
				if (isAxiosError(error)) {
					console.error(error);
				} else {
					console.error(error);
				}
			}
		}
		fetchUserData();
	}, []);

	async function onSubmit(data: FieldValues) {
		try {
			const { email, nickname, avatar } = data;
			let fakeAvatar = '';
			if (email !== auth.email || nickname !== auth.name || isAvatarChanged) {
				const formData = new FormData();
				formData.append('email', email);
				formData.append('nickname', nickname);
				if (isAvatarChanged) {
					const file = avatar ? avatar[0] : null;
					fakeAvatar = file ? URL.createObjectURL(file) : '';
					formData.append('avatar', file);
				}
				const response = await updateUserAccount(formData);
				if (response.status === 200) {
					setAuth({ ...auth, email, name: nickname });
					if (isAvatarChanged) {
						setAuth({ ...auth, avatar: fakeAvatar });
					}
				}
			}
		} catch (error) {
			if (isAxiosError(error)) {
				const whichInputError = error.response?.data.message.includes('email') ? 'email' : 'name';
				setError(whichInputError, {
					type: error.response?.data.status,
					message: error.response?.data.message,
				});
			} else {
				console.error(error);
			}
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
			<AvatarInput
				register={register}
				watch={watch}
				resetField={resetField}
				className={styles.form__input}
				changeIsAvatarChanged={setIsAvatarChanged}
				authAvatar={auth.avatar}
			/>
			<EmailInput
				register={register}
				type='email'
				errors={errors}
				label='Email'
				className={styles.form__input}
				name='email'
				setError={setError}
				clearErrors={clearErrors}
			/>
			<NameInput
				register={register}
				errors={errors}
				label='暱稱'
				name='nickname'
				className={styles.form__input}
				setError={setError}
				clearErrors={clearErrors}
			/>
			<Button type='submit' disabled={!isValid || isSubmitting} className={styles.form__btn}>
				{isSubmitting ? '送出中...' : '確認送出'}
			</Button>
		</form>
	);
}
