import { useState, useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import AvatarInput from '../../../../components/AvatarInput';
import FormInput, { EmailInput } from '../../../../components/FormInput';
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
	} = useForm<FieldValues>({ values: { email: auth.email, name: auth.name, avatar: null } });
	const [isAvatarChanged, setIsAvatarChanged] = useState<boolean>(false);

	useEffect(() => {
		async function fetchUserData() {
			try {
				const response = await getUserData();
				if (response.status === 200) {
					setAuth({ ...auth, email: response.data.email, name: response.data.nickname });
				}
			} catch (error) {
				if (isAxiosError(error)) {
					setError('email', {
						type: error.response?.data.status,
						message: error.response?.data.message,
					});
				} else {
					console.error(error);
				}
			}
		}
		if (!auth.email && !auth.name) {
			fetchUserData();
		}
	}, []);

	async function onSubmit(data: FieldValues) {
		try {
			const { email, name, avatar } = data;
			let fakeAvatar = '';
			if (email !== auth.email || name !== auth.name || isAvatarChanged) {
				console.log(data);
				const formData = new FormData();
				formData.append('email', email);
				formData.append('nickname', name);
				if (isAvatarChanged) {
					const file = avatar ? avatar[0] : null;
					fakeAvatar = file ? URL.createObjectURL(file) : '';
					formData.append('avatar', file);
				}
				for (const [key, value] of formData.entries()) {
					console.log(key, value);
				}
				const response = await updateUserAccount(formData);
				if (response.status === 200) {
					setAuth({ ...auth, email, name, avatar: fakeAvatar });
				}
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError('email', {
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
			<FormInput
				register={register}
				errors={errors}
				label='暱稱'
				name='name'
				className={styles.form__input}
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
			<Button type='submit' disabled={!isValid || isSubmitting} className={styles.form__btn}>
				{isSubmitting ? '送出中...' : '確認送出'}
			</Button>
		</form>
	);
}
