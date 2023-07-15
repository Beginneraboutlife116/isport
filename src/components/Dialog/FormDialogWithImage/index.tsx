import { useState, useRef, useEffect, Dispatch, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { IoMdCloseCircle } from 'react-icons/io';
import FormInput, { EmailInput } from '../../FormInput';
import Button from '../../Button';
import styles from './styles.module.scss';

type FormDialogWithImageProps = {
	buttonDescription: string;
	status: boolean;
	handleDialogToggle: Dispatch<boolean>;
};

export default function FormDialogWithImage({
	buttonDescription,
	status,
	handleDialogToggle,
}: FormDialogWithImageProps) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		setError,
		clearErrors,
		resetField,
		reset,
	} = useForm();
	const [textCount, setTextCount] = useState(0);
	const [{ imgSrc, imgName }, setImgInfo] = useState({
		imgSrc: '',
		imgName: '',
	});
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (dialog) {
			if (status && !dialog.open) {
				dialog.show();
			} else if (!status) {
				dialog.close();
			}
		}
		return () => {
			const dialog = dialogRef.current;
			if (dialog) {
				dialog.close();
			}
		};
	}, [status]);

	const files = watch('image', null);

	useEffect(() => {
		if (files && files.length > 0) {
			const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
			const fileData = files[0];
			if (validateFormat.includes(fileData.type)) {
				setImgInfo({ imgSrc: URL.createObjectURL(fileData), imgName: fileData.name });
				clearErrors('image');
			} else {
				setImgInfo({ imgSrc: '', imgName: '' });
				setError('image', { type: 'pattern', message: '不支援的圖片格式' });
			}
		} else {
			setImgInfo({ imgSrc: '', imgName: '' });
		}
	}, [files]);

	function handleBlur(name: string) {
		return (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				setError(name, { type: 'required', message: `必須輸入${name}` });
			}
		};
	}

	return (
		<dialog ref={dialogRef} className={styles.dialog}>
			<Button
				onClick={() => {
					reset();
					handleDialogToggle(false);
				}}
				className={styles['btn--close']}
			>
				<IoMdCloseCircle />
			</Button>

			<form onSubmit={handleSubmit((data) => console.log(data))} className={styles.form}>
				<FormInput
					label='場館名稱'
					labelClassName={styles.label}
					inputClassName={styles.input}
					name='name'
					register={register}
					errors={errors}
					rules={{
						required: true,
						maxLength: 50,
						onBlur: handleBlur('name'),
						onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							if (target.value.length > 50) {
								setError('name', { type: 'maxLength', message: '場館名稱不可超過 50 字元' });
							} else {
								clearErrors('name');
							}
						},
					}}
				/>
				<FormInput
					label='場館地址'
					labelClassName={styles.label}
					inputClassName={styles.input}
					name='address'
					register={register}
					errors={errors}
					rules={{
						required: true,
						maxLength: 100,
						onBlur: handleBlur('address'),
						onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							if (target.value.length > 100) {
								setError('address', { type: 'maxLength', message: '場館地址不可超過 100 字元' });
							} else {
								clearErrors('address');
							}
						},
					}}
				/>
				<FormInput
					label='場館電話'
					labelClassName={styles.label}
					inputClassName={styles.input}
					name='phone'
					register={register}
					errors={errors}
					rules={{
						required: true,
						pattern: /^09\d{8}$/,
						onBlur: handleBlur('phone'),
						onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							const pattern = /^09\d{8}$/;
							if (!pattern.test(target.value)) {
								setError('phone', { type: 'pattern', message: '電話號碼格式錯誤' });
							} else {
								clearErrors('phone');
							}
						},
					}}
				/>
				<EmailInput
					label='場館Email'
					name='email'
					labelClassName={styles.label}
					inputClassName={styles.input}
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
				/>
				<label className={styles.textarea}>
					場館介紹
					<textarea
						{...register('introduction', {
							required: true,
							maxLength: 300,
							onBlur: handleBlur('introduction'),
							onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
								const { target } = event;
								setTextCount(target.value.length);
								if (target.value.length > 300) {
									setError('introduction', {
										type: 'maxLength',
										message: '場館介紹不可超過 300 字元',
									});
								} else {
									clearErrors('introduction');
								}
							},
						})}
					/>
					<p>
						{errors['introduction'] && (
							<span className={styles.textarea__error}>
								{errors['introduction'].message as ReactNode}
							</span>
						)}
						<span>{textCount} / 300</span>
					</p>
				</label>
				<div className={styles.uploadImage}>
					{errors['image'] && (
						<span className={styles.uploadImage__error}>
							{errors['image'].message as ReactNode}
						</span>
					)}
					<div>
						<img
							src={imgSrc || 'https://fakeimg.pl/320x180/?text=Hello'}
							alt={imgName || '場館照片'}
							className={styles.uploadImage__image}
						/>
					</div>

					<label htmlFor='image' className={styles['btn--image']}>
						請選擇檔案
					</label>

					<Button
						type='button'
						onClick={() => {
							if (imgSrc) {
								resetField('image');
							}
						}}
						className={styles['btn--reset']}
						disabled={!imgSrc}
					>
						取消圖
					</Button>

					<input
						className='hidden'
						type='file'
						id='image'
						accept='./jpg, ./png, ./jpeg, image/*'
						{...register('image', {
							required: true,
							validate: {
								pattern: (value) => {
									const file = value[0];
									const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
									return validateFormat.includes(file.type);
								},
							},
						})}
					/>
				</div>
				<Button type='submit' className={styles['btn--submit']} disabled={!isValid}>
					{buttonDescription}
				</Button>
			</form>
		</dialog>
	);
}
