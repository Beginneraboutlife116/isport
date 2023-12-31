import { useState, useRef, useEffect, ReactNode, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { EmailInput, NameInput, handleOnBlur } from '../../FormInput';
import Dialog from '../../Dialog';
import Button from '../../Button';
import styles from '../styles.module.scss';

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
		register,
		handleSubmit,
		formState: { errors, isValid, dirtyFields },
		setError,
		clearErrors,
		resetField,
		reset,
		watch,
	} = useForm<FieldValues>({
		values: {
			email: editingStore?.email || '',
			phone: editingStore?.phone || '',
			introduction: editingStore?.introduction || '',
			address: editingStore?.address || '',
			storeName: editingStore?.storeName || '',
			photo: editingStore?.photo || null,
		},
	});
	const [{ imgSrc, imgName }, setImgInfo] = useState({
		imgSrc: '',
		imgName: '',
	});
	const dialogRef = useRef<HTMLDialogElement>(null);
	const [photoChanged, setPhotoChanged] = useState(false);
	const [isPending, setIsPending] = useState<boolean>(false);

	useEffect(() => {
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
		setImgInfo({ imgSrc: editingStore?.photo || '', imgName: editingStore?.storeName || '' });

		return () => {
			if (dialog && dialog.open) {
				dialog.close();
				setImgInfo({ imgSrc: '', imgName: '' });
				setPhotoChanged(false);
			}
		};
	}, [isOpen]);

	let btnDisabled = false;
	if (!editingStore) {
		btnDisabled = !isValid || isPending;
	} else {
		btnDisabled = !Object.values(dirtyFields).some((item) => item) || !isValid || isPending;
	}

	return (
		<Dialog ref={dialogRef} key={editingStore?.id || 0} closeDialog={closeDialog}>
			<form
				onSubmit={handleSubmit((data) => {
					const formData = new FormData();
					for (const [key, value] of Object.entries(data)) {
						if (key === 'photo') {
							if (photoChanged) {
								const file = (value as FileList)[0];
								formData.append(key, file);
							}
						} else {
							formData.append(key, value);
						}
					}
					handleDialogSubmit(formData, reset, setError, setIsPending);
				})}
				className={styles.form}
			>
				<NameInput
					label='場館名稱'
					labelClassName={styles.label}
					inputClassName={styles.input}
					name='storeName'
					register={register}
					errorMessage={(errors.storeName?.message || '') as string}
					setError={setError}
					clearErrors={clearErrors}
				/>
				<NameInput
					label='場館地址'
					labelClassName={styles.label}
					inputClassName={styles.input}
					name='address'
					register={register}
					errorMessage={(errors.address?.message || '') as string}
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
					errorMessage={(errors.phone?.message || '') as string}
					setError={setError}
					clearErrors={clearErrors}
				/>
				<EmailInput
					label='場館Email'
					labelClassName={styles.label}
					inputClassName={styles.input}
					register={register}
					errorMessage={(errors.email?.message || '') as string}
					setError={setError}
					clearErrors={clearErrors}
				/>
				<label className={styles.textarea}>
					場館介紹
					<textarea
						{...register('introduction', {
							required: true,
							maxLength: 300,
							onBlur: handleOnBlur('introduction', setError, '場館介紹'),
							onChange: (event: ChangeEvent<HTMLTextAreaElement>) => {
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

					<div className={styles['uploadImage__btn-wrapper']}>
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
							清空圖
						</Button>
					</div>

					<input
						className='hidden'
						type='file'
						id='photo'
						accept='image/jpg, image/png, image/jpeg'
						{...register('photo', {
							required: !editingStore,
							validate: {
								fileType: (value) => {
									if (!editingStore) {
										const file = value[0];
										const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
										return validateFormat.includes(file.type);
									}
								},
							},
							onBlur: handleOnBlur('photo', setError,'場館照片'),
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
					{isPending ? '送出中...' : buttonText}
				</Button>
			</form>
		</Dialog>
	);
}
