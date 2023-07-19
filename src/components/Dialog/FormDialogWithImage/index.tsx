import { useState, useRef, useEffect, Dispatch, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { IoMdCloseCircle } from 'react-icons/io';
import FormInput, { EmailInput, NameInput } from '../../FormInput';
import Button from '../../Button';
import styles from './styles.module.scss';

type StoreType = {
	id: number;
	storeName: string;
	photo: string;
	address: string;
	email: string;
	phone: string;
	introduction: string;
};

type FormDialogWithImageProps = {
	status: boolean;
	handleDialogToggle: Dispatch<boolean>;
	onSubmit: (data: FieldValues) => void;
	editingStore?: StoreType;
	fetchStatus: {
		type: 'idle' | 'pending' | 'success' | 'error';
		error: { type: string; message: string } | null;
	};
};

export default function FormDialogWithImage({
	status,
	handleDialogToggle,
	onSubmit,
	editingStore,
	fetchStatus,
}: FormDialogWithImageProps) {
	const {
		email = '',
		phone = '',
		introduction = '',
		address = '',
		storeName = '',
		photo = null,
		id = 0,
	} = editingStore || {};
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitting },
		setError,
		clearErrors,
		resetField,
		reset,
	} = useForm<FieldValues>({
		values: { email, phone, introduction, address, storeName, photo },
	});
	const [textCount, setTextCount] = useState(0);
	const [{ imgSrc, imgName }, setImgInfo] = useState({
		imgSrc: photo,
		imgName: storeName,
	});
	const dialogRef = useRef<HTMLDialogElement>(null);
	const { type, error } = fetchStatus;

	useEffect(() => {
		const dialog = dialogRef.current;
		if (dialog) {
			if (status && !dialog.open) {
				dialog.show();
			} else if (!status) {
				dialog.close();
				setImgInfo({ imgSrc: '', imgName: '' });
			}
		}

		if (type === 'success') {
			reset();
			setImgInfo({ imgSrc: '', imgName: '' });
		}

		if (type === 'error' && error) {
			const { type, message } = error;
			const whichTypeInput = message.includes('地址') ? 'address' : 'storeName';
			setError(whichTypeInput, {
				type,
				message,
			});
		}

		return () => {
			const dialog = dialogRef.current;
			if (dialog) {
				dialog.close();
				setImgInfo({ imgSrc: '', imgName: '' });
				reset();
			}
		};
	}, [status, type, error]);

	function handleBlur(name: string) {
		return (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				setError(name, { type: 'required', message: `必須輸入${name}` });
			}
		};
	}

	return (
		<dialog ref={dialogRef} className={styles.dialog} key={id}>
			<Button
				onClick={() => {
					reset();
					handleDialogToggle(false);
				}}
				className={styles['btn--close']}
			>
				<IoMdCloseCircle />
			</Button>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className={styles.form}
			>
				<NameInput
					label='場館名稱'
					labelClassName={styles.label}
					inputClassName={styles.input}
					name='storeName'
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
				/>
				<NameInput
					label='場館地址'
					labelClassName={styles.label}
					inputClassName={styles.input}
					name='address'
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					maxLength={100}
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
						pattern: /^0\d{8,}$/,
						onBlur: handleBlur('phone'),
						onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							const pattern = /^0\d{8,}$/;
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
					{errors['photo'] && (
						<span className={styles.uploadImage__error}>
							{errors['photo'].message as ReactNode}
						</span>
					)}
					<div>
						<img
							src={imgSrc || 'https://fakeimg.pl/320x180/?text=PICTURE'}
							alt={imgName || '場館照片'}
							className={styles.uploadImage__image}
						/>
					</div>

					<label htmlFor='photo' className={styles['btn--image']}>
						請選擇檔案
					</label>

					<Button
						type='button'
						onClick={() => {
							if (imgSrc) {
								resetField('photo');
								setImgInfo({ imgSrc: '', imgName: '' });
								setError('photo', { type: 'required', message: '請選擇圖片' });
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
						id='photo'
						accept='image/jpg, image/png, image/jpeg'
						{...register('photo', {
							required: true,
							validate: {
								fileType: (value) => {
									const file = value[0];
									const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
									return validateFormat.includes(file.type);
								},
							},
							onBlur: handleBlur('photo'),
							onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
								const file = event.target.files?.[0];
								if (file) {
									const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
									if (validateFormat.includes(file.type)) {
										setImgInfo({ imgSrc: URL.createObjectURL(file), imgName: file.name });
										clearErrors('photo');
									} else {
										resetField('photo');
										setError('photo', { type: 'fileType', message: '不支援的圖片格式' });
									}
								} else {
									resetField('photo');
									setImgInfo({ imgSrc: '', imgName: '' });
								}
							},
						})}
					/>
				</div>
				<Button type='submit' className={styles['btn--submit']} disabled={!isValid || isSubmitting}>
					{isSubmitting ? '送出中...' : id ? '修改送出' : '送出'}
				</Button>
			</form>
		</dialog>
	);
}
