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
		formState: { isValid, errors, isSubmitting, dirtyFields },
		setError,
		clearErrors,
	} = useForm<FieldValues>({ values: { email: auth.email, nickname: auth.name, avatar: null } });
	const [imgInfo, setImgInfo] = useState<{ imgSrc: string; imgName: string }>({
		imgSrc: '',
		imgName: '',
	});

	useEffect(() => {
		async function fetchUserData() {
			try {
				const response = await getUserData();
				if (response.status === 200) {
					setAuth((a) => ({ ...a, email: response.data.email, name: response.data.nickname }));
					setImgInfo({
						imgSrc: response.data.avatar || '',
						imgName: response.data.nickname || '',
					});
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
			if (Object.values(dirtyFields).some((value) => value)) {
				let fakeAvatar = '';
				const file = avatar ? avatar[0] : null;
				fakeAvatar = file ? URL.createObjectURL(file) : auth.avatar;

				const formData = new FormData();
				formData.append('email', email);
				formData.append('nickname', nickname);
				formData.append('avatar', file);
				const response = await updateUserAccount(formData);
				if (response.status === 200) {
					setAuth({ ...auth, email, name: nickname, avatar: fakeAvatar });
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

	const avatarError = errors['avatar']?.message || '';
	const emailError = errors['email']?.message || '';
	const nameError = errors['nickname']?.message || '';

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
			<AvatarInput
				className={styles.form__input}
				imgInfo={imgInfo}
				errorMessage={avatarError as string}
				{...register('avatar', {
					validate: {
						fileType: (v) => {
							if (v && v[0]) {
								const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
								return validateFormat.includes(v[0].type);
							}
						},
					},
					onChange: (e) => {
						const file = e.target.files?.[0];
						if (file) {
							clearErrors('avatar');
							const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
							if (validateFormat.includes(file.type)) {
								setImgInfo({ imgSrc: URL.createObjectURL(file), imgName: file.name });
							} else {
								setError('avatar', {
									type: 'fileType',
									message: '不支援的圖片格式',
								});
							}
						}
					},
				})}
			/>
			<EmailInput
				register={register}
				label='Email'
				className={styles.form__input}
				setError={setError}
				clearErrors={clearErrors}
				errorMessage={emailError as string}
			/>
			<NameInput
				register={register}
				errorMessage={nameError as string}
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
