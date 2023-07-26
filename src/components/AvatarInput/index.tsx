import { forwardRef, useRef, ChangeEventHandler } from 'react';
import { BiSolidUserCircle, BiPlus } from 'react-icons/bi';
import Button from '../Button';
import styles from './styles.module.scss';

type AvatarInputProps = {
	className?: string;
	name: string;
	imgInfo: { imgSrc: string; imgName: string };
	errorMessage: string;
	onChange: ChangeEventHandler<HTMLInputElement>;
};

const AvatarInput = forwardRef<HTMLInputElement, AvatarInputProps>(function AvatarInput(
	{ className, imgInfo, errorMessage, ...props }: AvatarInputProps,
	ref,
) {
	const labelRef = useRef<HTMLLabelElement>(null);

	return (
		<div style={{ position: 'relative' }}>
			<label
				className={`${styles.previewAvatar} ${className ?? ''}`.trim()}
				aria-label='上傳你的大頭照'
				ref={labelRef}
			>
				{imgInfo.imgSrc ? (
					<img src={imgInfo.imgSrc} alt={imgInfo.imgName} />
				) : (
					<BiSolidUserCircle />
				)}
				{errorMessage && <p className={styles['previewAvatar--error']}>{errorMessage}</p>}
				<input
					type='file'
					accept='image/jpg, image/png, image/jpeg'
					ref={ref}
					className='hidden'
					tabIndex={-1}
					{...props}
				/>
			</label>
			<Button
				type='button'
				className={styles['previewAvatar--btn']}
				onClick={() => labelRef.current?.click()}
			>
				<BiPlus />
			</Button>
		</div>
	);
});
export default AvatarInput;
