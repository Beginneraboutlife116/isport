import { useState, useRef, useEffect, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { EmailInput, NameInput } from '../../FormInput';
import { createStore, updateStore } from '../../../api/owner';
import { isAxiosError } from '../../../util/helpers';
import Dialog from '../../Dialog';
import Button from '../../Button';
import styles from './styles.module.scss';

export type StoreType = {
	id: number;
	storeName: string;
	photo: string;
	address: string;
	email: string;
	phone: string;
	introduction: string;
};

type FormDialogWithImageProps = {
	isOpen: boolean;
	editingStore?: StoreType;
	closeDialog: Function;
	handleDialogSubmit: Function;
	buttonText: string;
};

export default function FormDialogWithImage({
	isOpen,
	editingStore,
	closeDialog,
	handleDialogSubmit,
	buttonText,
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
		formState: { errors, isValid, dirtyFields, isSubmitSuccessful },
		setError,
		clearErrors,
		resetField,
		reset,
		watch,
	} = useForm<FieldValues>({
		values: {
			email,
			phone,
			introduction,
			address,
			storeName,
			photo,
		},
	});
	const [{ imgSrc, imgName }, setImgInfo] = useState({
		imgSrc: photo,
		imgName: storeName,
	});
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [photoChanged, setPhotoChanged] = useState(false);
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		setImgInfo({ imgSrc: photo, imgName: storeName });
		const dialog = dialogRef.current;
		if (dialog) {
			if (isOpen && !dialog.open) {
				dialog.show();
			} else if (!isOpen) {
				dialog.close();
				setImgInfo({ imgSrc: '', imgName: '' });
				setPhotoChanged(false);
			}
		}
		return () => {
			if (dialog && dialog.open) {
				dialog.close();
				setImgInfo({ imgSrc: '', imgName: '' });
				setPhotoChanged(false);
			}
		};
	}, [isOpen]);

	function handleBlur(name: string, label: string) {
		return (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				setError(name, { type: 'required', message: `必須輸入${label}` });
			}
		};
	}

	async function onSubmitToUpdate(id: number, data: FieldValues) {
		try {
			if (Object.values(dirtyFields).some((value) => value)) {
				const formData = new FormData();
				let fakePhoto: string = photo || '';
				for (const [key, value] of Object.entries(data)) {
					if (key === 'photo' && photoChanged) {
						const file = data.photo[0];
						formData.append(key, file);
						fakePhoto = URL.createObjectURL(file);
					}
					formData.append(key, value);
				}
				setIsPending(true);
				const response = await updateStore(id, formData);
				if (response.status === 200) {
					closeDialog();
					handleDialogSubmit({ ...data, photo: fakePhoto, id });
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsPending(false);
		}
	}

	let btnDisabled = false;
	if (id === 0) {
		btnDisabled = !isValid || isSubmitSuccessful;
	} else {
		btnDisabled =
			(!Object.values(dirtyFields).some((item) => item) && isValid) || isSubmitSuccessful;
	}

	return (
		<Dialog ref={dialogRef} key={id} closeDialog={closeDialog}>
			<form
				onSubmit={handleSubmit((data) => {
					const formData = new FormData();
					for (const [key, value] of Object.entries(data)) {
						if (key === 'photo' && photoChanged) {
							const file = (value as FileList)[0];
							formData.append(key, file);
						}
						formData.append(key, value);
					}
					handleDialogSubmit(formData, reset, setError);
				})}
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
				<NameInput
					label='場館電話'
					labelClassName={styles.label}
					inputClassName={styles.input}
					name='phone'
					register={register}
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
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
							onBlur: handleBlur('introduction', '場館介紹'),
							onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => {
								const { target } = event;
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
						<span>{watch('introduction').length} / 300</span>
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
								setPhotoChanged(true);
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
							required: id === 0,
							validate: {
								fileType: (value) => {
									if (id === 0) {
										const file = value[0];
										const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
										return validateFormat.includes(file.type);
									}
								},
							},
							onBlur: handleBlur('photo', '場館照片'),
							onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
								const file = event.target.files?.[0];
								if (file) {
									const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
									if (validateFormat.includes(file.type)) {
										setImgInfo({ imgSrc: URL.createObjectURL(file), imgName: file.name });
										setPhotoChanged(true);
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
				<Button type='submit' className={styles['btn--submit']} disabled={btnDisabled}>
					{isSubmitSuccessful ? '送出中...' : buttonText}
				</Button>
			</form>
		</Dialog>
	);
}
