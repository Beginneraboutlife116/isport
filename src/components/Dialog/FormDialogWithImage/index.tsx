import { useState, useRef, useEffect, Dispatch, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import type { FieldValues } from 'react-hook-form';
import { IoMdCloseCircle } from 'react-icons/io';
import FormInput, { EmailInput, NameInput } from '../../FormInput';
import { createStore, updateStore } from '../../../api/owner';
import { useStoresData } from '../../../contexts/findContext';
import { isAxiosError } from '../../../util/helpers';
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
	status: boolean;
	editingStore?: StoreType;
	setEditingStore: Dispatch<StoreType | {}>;
	closeDialog: () => void;
	searchTerm?: string;
};

export default function FormDialogWithImage({
	status,
	editingStore,
	setEditingStore,
	closeDialog,
	searchTerm,
}: FormDialogWithImageProps) {
	const { storesData, setStoresData, filteredData, setFilteredData } = useStoresData();
	const { email, phone, introduction, address, storeName, photo, id = 0 } = editingStore || {};
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
			email: email || '',
			phone: phone || '',
			introduction: introduction || '',
			address: address || '',
			storeName: storeName || '',
			photo: null,
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
			if (status && !dialog.open) {
				dialog.show();
			} else if (!status) {
				dialog.close();
			}
		}

	}, [status]);

	function handleBlur(name: string, label: string) {
		return (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				setError(name, { type: 'required', message: `必須輸入${label}` });
			}
		};
	}

	async function onSubmitToCreate(data: FieldValues) {
		try {
			const formData = new FormData();
			const fakeStore: { [key: string]: unknown } = {};
			for (const [key, value] of Object.entries(data)) {
				if (key === 'photo') {
					const file = value[0];
					fakeStore[key] = URL.createObjectURL(file);
					formData.append(key, file);
				} else {
					formData.append(key, value);
					if (key !== 'email' && key !== 'phone') {
						fakeStore[key] = value;
					}
				}
			}
			setIsPending(true);
			const response = await createStore(formData);
			if (response.status === 200) {
				reset();
				closeDialog();
				fakeStore.id = response.data.id;
				fakeStore.rating = 0;
				fakeStore.reviewCounts = 0;
				setStoresData([...storesData, fakeStore]);
				if (searchTerm) {
					if (data.storeName.includes(searchTerm)) {
						setFilteredData([...filteredData, fakeStore]);
					}
				} else {
					setFilteredData([...filteredData, fakeStore]);
				}
			}
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				const { data } = error.response;
				const whichTypeInput = data.message.includes('地址') ? 'address' : 'storeName';
				setError(whichTypeInput, {
					type: data.status,
					message: data.message,
				});
			} else {
				console.error(error);
			}
		} finally {
			setIsPending(false);
		}
	}

	async function onSubmitToUpdate(id: number, data: FieldValues) {
		try {
			if (Object.values(dirtyFields).some((value) => value)) {
				const formData = new FormData();
				let fakePhoto: string = editingStore?.photo || '';
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
					setEditingStore({});
					setStoresData(
						storesData.map((store) => {
							if (store.id === id) {
								const { storeName, address, introduction } = data;
								return { ...store, storeName, address, introduction, photo: fakePhoto };
							}
							return store;
						}),
					);
					if (searchTerm !== '') {
						if (data.storeName.includes(searchTerm)) {
							setFilteredData(
								filteredData.map((store) => {
									if (store.id === id) {
										const { storeName, address, introduction } = data;
										return { ...store, storeName, address, introduction, photo: fakePhoto };
									}
									return store;
								}),
							);
						}
					} else {
						setFilteredData(
							filteredData.map((store) => {
								if (store.id === id) {
									const { storeName, address, introduction } = data;
									return { ...store, storeName, address, introduction, photo: fakePhoto };
								}
								return store;
							}),
						);
					}
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
		btnDisabled = !isValid || isPending;
	} else {
		btnDisabled = !Object.values(dirtyFields).some((item) => item) || isPending;
	}

	return (
		<dialog ref={dialogRef} className={styles.dialog} key={id}>
			<Button
				onClick={() => {
					setEditingStore({});
					closeDialog();
				}}
				className={styles['btn--close']}
			>
				<IoMdCloseCircle />
			</Button>

			<form
				onSubmit={handleSubmit((data) => {
					if (id === 0) {
						onSubmitToCreate(data);
					} else {
						onSubmitToUpdate(id, data);
					}
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
						onBlur: handleBlur('phone', '場館電話'),
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
					{isPending ? '送出中...' : id ? '修改送出' : '送出'}
				</Button>
			</form>
		</dialog>
	);
}
