import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BiSolidUserCircle } from 'react-icons/bi';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import styles from './styles.module.scss';

export default function NextSignupPage() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { isValid },
	} = useForm();
	const file = watch('avatar', null);
	console.log("🚀 ~ file: index.tsx:17 ~ NextSignupPage ~ file:", file)
	const validateFormat = ['image/jpg', 'image/png', 'image/jpeg', 'image/*'];
	let imgSrc: string = '';
	let imgName: string = '';
	let doesTypeCorrect: boolean = true;
	if (file && file.length !== 0) {
		const fileData = file[0];
		if (validateFormat.includes(fileData.type)) {
			imgSrc = URL.createObjectURL(file[0]);
			imgName = file[0].name;
			doesTypeCorrect = true;
		} else {
			imgSrc = '';
			imgName = '';
			doesTypeCorrect = false;
		}
	}

	return (
		<main className={styles.nextSignup}>
			<h1 className={styles.nextSignup__title}>用戶註冊 Step 2</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<label htmlFor='avatar' className={styles.previewAvatar}>
					{imgSrc ? <img src={imgSrc} alt={imgName} /> : <BiSolidUserCircle />}
					{!doesTypeCorrect && <p className={styles.error}>所上傳的檔案不支援</p>}
				</label>
				<input
					type='file'
					{...register('avatar')}
					id='avatar'
					accept='./jpg, ./png, ./jpeg, image/*'
					className={styles.nextSignup__input}
					tabIndex={-1}
				/>
				<FormInput
					register={register}
					placeholder='請輸入 暱稱'
					id='name'
					className={styles.nextSignup__input}
				/>
				<Button type='submit' disabled={!isValid} className={styles.nextSignup__btn}>
					送出
				</Button>
			</form>
			<Link to='/find'>
				<Button className={styles.nextSignup__skip}>skip</Button>
			</Link>
		</main>
	);
}
