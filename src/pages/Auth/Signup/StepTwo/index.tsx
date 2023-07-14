import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import FormInput from '../../../../components/FormInput';
import Button from '../../../../components/Button';
import authStyles from '../../styles.module.scss';
import styles from './styles.module.scss';
import AvatarInput from '../../../../components/AvatarInput';

export default function SignupStepTwoPage() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { isValid, errors },
		resetField,
		setError,
		clearErrors,
	} = useForm();

	return (
		<>
			<h1 className={authStyles.auth__title}>用戶註冊 Step 2</h1>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<AvatarInput
					register={register}
					watch={watch}
					className={authStyles.auth__input}
					resetField={resetField}
				/>
				<FormInput
					register={register}
					errors={errors}
					name='name'
					placeholder='請輸入暱稱'
					className={authStyles.auth__input}
					rules={{
						maxLength: 50,
						onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							if (target.value.length > 50) {
								setError('name', { type: 'maxLength', message: '暱稱不能大於50個字' });
							} else {
								clearErrors('name');
							}
						},
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
