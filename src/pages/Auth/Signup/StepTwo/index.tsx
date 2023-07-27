import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';
import { NameInput } from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import { useAuth } from '../../../../contexts/authContext';
import authStyles from '../../styles.module.scss';
import styles from './styles.module.scss';
import AvatarInput from '../../../../components/AvatarInput';
import { updateUserAccount } from '../../../../api/user';
import { isAxiosError } from '../../../../util/helpers';

export default function SignupStepTwoPage() {
	const [auth, setAuth] = useAuth();
	const {
		register,
		handleSubmit,
		formState: { isValid, errors, isSubmitting },
		setError,
		clearErrors,
	} = useForm<FieldValues>({ values: { nickname: auth.name } });
	const [imgInfo, setImgInfo] = useState<{ imgSrc: string; imgName: string }>({
		imgSrc: '',
		imgName: '',
	});

	const navigate = useNavigate();

	async function onSubmit(data: FieldValues) {
		try {
			const { nickname, avatar } = data;
			let fakeAvatar = '';
			const file = avatar ? avatar[0] : null;
			fakeAvatar = file ? URL.createObjectURL(file) : '';

			const formData = new FormData();
			formData.append('nickname', nickname);
			formData.append('email', auth.email);
			formData.append('avatar', file);
			const response = await updateUserAccount(formData);
			if (response.status === 200) {
				setAuth({ ...auth, name: nickname, avatar: fakeAvatar });
				navigate('/find');
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setError('nickname', {
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
					className={authStyles.auth__input}
					imgInfo={imgInfo}
					errorMessage={(errors['avatar']?.message ?? '') as string}
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
				<NameInput
					register={register}
					errorMessage={(errors['nickname']?.message ?? '') as string}
					name='nickname'
					setError={setError}
					clearErrors={clearErrors}
					placeholder='請輸入暱稱'
					className={authStyles.auth__input}
				/>
				<Button type='submit' disabled={!isValid || isSubmitting} className={authStyles.auth__btn}>
					{isSubmitting ? '送出中...' : '確認送出'}
				</Button>
			</form>
			<Link to='/find'>
				<Button className={styles.skip}>skip</Button>
			</Link>
		</>
	);
}
