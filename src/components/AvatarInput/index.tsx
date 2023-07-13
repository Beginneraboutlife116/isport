import { useEffect, useState, useRef, type Dispatch } from 'react';
import { BiSolidUserCircle, BiPlus, BiRedo } from 'react-icons/bi';
import { ActionType } from '../../util/useErrors';
import styles from './styles.module.scss';
import { UseFormRegister, FieldValues, UseFormWatch, UseFormResetField } from 'react-hook-form';

type AvatarInputProps = {
	register: UseFormRegister<FieldValues>;
	watch: UseFormWatch<FieldValues>;
	onReset: UseFormResetField<FieldValues>;
	errors: { [key: string]: string };
	errorKey: string | undefined;
	dispatch: Dispatch<ActionType>;
	className?: string;
};

export default function AvatarInput({
	register,
	errors,
	errorKey,
	dispatch,
	className,
	watch,
	onReset,
}: AvatarInputProps) {
	const [{ imgSrc, imgName }, setImgInfo] = useState({ imgSrc: '', imgName: '' });
	const labelRef = useRef<HTMLLabelElement>(null);

	const files = watch('avatar', null);
	useEffect(() => {
		if (files && files.length > 0) {
			const fileData = files[0];
			const validateFormat = ['image/jpg', 'image/png', 'image/jpeg', 'image/*'];
			if (validateFormat.includes(fileData.type)) {
				setImgInfo({ imgSrc: URL.createObjectURL(fileData), imgName: fileData.name });
				dispatch({ type: 'avatar', status: 'pass' });
			} else {
				onReset('avatar');
				setImgInfo({ imgSrc: '', imgName: '' });
				dispatch({ type: 'avatar', status: 'notSupport' });
			}
		}
	}, [files]);

	function handleClick() {
		if (imgSrc) {
			onReset('avatar');
			setImgInfo({ imgSrc: '', imgName: '' });
			dispatch({ type: 'avatar', status: 'pass' });
		} else {
			labelRef.current?.click();
		}
	}

	let errorMessage = null;
	if (errors && errorKey) {
		errorMessage = errors[errorKey];
	} else {
		errorMessage = null;
	}

	return (
		<div style={{ position: 'relative' }}>
			<label
				className={`${styles.previewAvatar} ${className ?? ''}`.trim()}
				aria-label='上傳你的大頭照'
				ref={labelRef}
			>
				{imgSrc ? <img src={imgSrc} alt={imgName} /> : <BiSolidUserCircle />}
				{errorMessage && <p className={styles['previewAvatar--error']}>{errorMessage}</p>}
				<input
					type='file'
					{...register('avatar')}
					id='avatar'
					accept='./jpg, ./png, ./jpeg, image/*'
					className='hidden'
					tabIndex={-1}
				/>
			</label>
			<div className={styles['previewAvatar--btn']} onClick={handleClick}>
				{imgSrc ? <BiRedo className={styles['previewAvatar--btn-icon']} /> : <BiPlus />}
			</div>
		</div>
	);
}
