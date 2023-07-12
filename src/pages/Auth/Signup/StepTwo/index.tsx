import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { BiSolidUserCircle } from 'react-icons/bi';
import { useErrors } from '../../../../util';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import authStyles from '../../styles.module.scss';
import styles from './styles.module.scss';

export default function SignupStepTwoPage() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { isValid },
	} = useForm();
	const { errors, state, dispatch } = useErrors();

	const file = watch('avatar', null);
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
		<>
			<h1 className={authStyles.auth__title}>用戶註冊 Step 2</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<label htmlFor='avatar' className={styles.previewAvatar}>
					{imgSrc ? <img src={imgSrc} alt={imgName} /> : <BiSolidUserCircle />}
					{!doesTypeCorrect && <p className={styles['previewAvatar--error']}>所上傳的檔案不支援</p>}
				</label>
				<input
					type='file'
					{...register('avatar')}
					id='avatar'
					accept='./jpg, ./png, ./jpeg, image/*'
					className={styles['input--file']}
					tabIndex={-1}
				/>
				<FormInput
					register={register}
					placeholder='請輸入 暱稱'
					errors={errors.name}
					errorKey={state.name}
					id='name'
					className={authStyles.auth__input}
					required={false}
					validate={(value) => {
						if (value.length > 50) {
							dispatch({ type: 'name', status: 'userExceed' });
							return false;
						} else {
							dispatch({ type: 'name', status: 'pass' });
							return true;
						}
					}}
				/>
				<Button type='submit' disabled={!isValid} className={authStyles.auth__btn}>
					送出
				</Button>
			</form>
			<Link to='/find'>
				<Button className={styles.skip}>skip</Button>
			</Link>
		</>
	);
}
