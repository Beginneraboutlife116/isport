import { useEffect, useState, useRef } from 'react';
import { BiSolidUserCircle, BiPlus, BiRedo } from 'react-icons/bi';
import styles from './styles.module.scss';
import { UseFormRegister, FieldValues, UseFormWatch, UseFormResetField } from 'react-hook-form';

type AvatarInputProps = {
	register: UseFormRegister<FieldValues>;
	className?: string;
	watch: UseFormWatch<FieldValues>;
	resetField: UseFormResetField<FieldValues>;
	name?: string;
};

export default function AvatarInput({
	register,
	className,
	watch,
	resetField,
	name = 'avatar',
}: AvatarInputProps) {
	const [{ imgSrc, imgName }, setImgInfo] = useState({ imgSrc: '', imgName: '' });
	const [errorKey, setErrorKey] = useState('pass');
	const labelRef = useRef<HTMLLabelElement>(null);
	const errors: { [key: string]: string } = {
		notSupport: '不支援的圖片格式',
		pass: '',
	};

	const files = watch('avatar', null);
	useEffect(() => {
		if (files && files.length > 0) {
			const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
			const fileData = files[0];
			setErrorKey('pass');
			if (validateFormat.includes(fileData.type)) {
				setImgInfo({ imgSrc: URL.createObjectURL(fileData), imgName: fileData.name });
			} else {
				resetField('avatar');
				setImgInfo({ imgSrc: '', imgName: '' });
				setErrorKey('notSupport');
			}
		} else {
			setImgInfo({ imgSrc: '', imgName: '' });
		}
	}, [files]);

	function handleClick() {
		if (imgSrc) {
			resetField('avatar');
		} else {
			labelRef.current?.click();
		}
	}

	return (
		<div style={{ position: 'relative' }}>
			<label
				className={`${styles.previewAvatar} ${className ?? ''}`.trim()}
				aria-label='上傳你的大頭照'
				ref={labelRef}
				onClick={() => {
					setErrorKey('pass');
				}}
			>
				{imgSrc ? <img src={imgSrc} alt={imgName} /> : <BiSolidUserCircle />}
				{errors[errorKey] && <p className={styles['previewAvatar--error']}>{errors[errorKey]}</p>}
				<input
					type='file'
					{...register(name)}
					accept='./jpg, ./png, ./jpeg, image/*'
					className={styles.hidden}
					tabIndex={-1}
				/>
			</label>
			<div className={styles['previewAvatar--btn']} onClick={handleClick}>
				{imgSrc ? <BiRedo className={styles['previewAvatar--btn-icon']} /> : <BiPlus />}
			</div>
		</div>
	);
}
