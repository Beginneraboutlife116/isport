import { useEffect, useState, useRef, SetStateAction, Dispatch } from 'react';
import { BiSolidUserCircle, BiPlus, BiRedo } from 'react-icons/bi';
import { UseFormRegister, FieldValues, UseFormWatch, UseFormResetField } from 'react-hook-form';
import Button from '../Button';
import styles from './styles.module.scss';

type AvatarInputProps = {
	register: UseFormRegister<FieldValues>;
	className?: string;
	watch: UseFormWatch<FieldValues>;
	resetField: UseFormResetField<FieldValues>;
	name?: string;
	changeIsAvatarChanged?: Dispatch<SetStateAction<boolean>>;
	authAvatar?: string;
};

export default function AvatarInput({
	register,
	className,
	resetField,
	name = 'avatar',
	changeIsAvatarChanged,
	authAvatar,
}: AvatarInputProps) {
	const [imgInfo, setImgInfo] = useState({
		imgSrc: authAvatar || '',
		imgName: '',
	});
	const [errorKey, setErrorKey] = useState('pass');
	const labelRef = useRef<HTMLLabelElement>(null);
	const errors: { [key: string]: string } = {
		notSupport: '不支援的圖片格式',
		pass: '',
	};

	useEffect(() => {
		setImgInfo({ ...imgInfo, imgSrc: authAvatar || '' });
	}, [authAvatar]);

	function handleCleanClick() {
		if (imgInfo.imgSrc) {
			resetField(name);
			setImgInfo({ imgSrc: '', imgName: '' });
			if (changeIsAvatarChanged) {
				changeIsAvatarChanged(true);
			}
		} else {
			labelRef.current?.click();
			setErrorKey('pass');
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
				{imgInfo.imgSrc ? (
					<img src={imgInfo.imgSrc} alt={imgInfo.imgName} />
				) : (
					<BiSolidUserCircle />
				)}
				{errors[errorKey] && <p className={styles['previewAvatar--error']}>{errors[errorKey]}</p>}
				<input
					type='file'
					accept='image/jpg, image/png, image/jpeg'
					{...register(name, {
						onChange: (event) => {
							const file = event.target.files[0];
							const validateFormat = ['image/jpg', 'image/png', 'image/jpeg'];
							if (file) {
								if (validateFormat.includes(file.type) && changeIsAvatarChanged) {
									setImgInfo({
										imgSrc: URL.createObjectURL(file),
										imgName: file.name,
									});
									changeIsAvatarChanged(true);
								} else {
									resetField(name);
									setErrorKey('notSupport');
								}
							} else {
								resetField(name);
								setImgInfo({ imgSrc: '', imgName: '' });
							}
						},
					})}
					className='hidden'
					tabIndex={-1}
				/>
			</label>
			<Button type='button' className={styles['previewAvatar--btn']} onClick={handleCleanClick}>
				{imgInfo.imgSrc ? <BiRedo className={styles['previewAvatar--btn-icon']} /> : <BiPlus />}
			</Button>
		</div>
	);
}
