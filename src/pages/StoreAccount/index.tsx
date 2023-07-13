import styled from './styles.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import { BiSolidUser } from 'react-icons/bi';

type FormData = {
	Email: string;
	Nickname: string;
};

type PasswordData = {
	Password: string;
	ConfirmPassword: string;
};

function AccountInput() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>(); // 指定泛型參數為FormData

	const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styled.container__formWrap}>
			<div className={styled.container__inputWrap}>
				<label htmlFor=''>Email</label>
				<input
					type='text'
					placeholder='Email'
					{...register('Email', { required: true, pattern: /^\S+@\S+$/i })}
					className={styled['container__inputWrap--input']}
				/>
				{errors.Email && (
					<span className={styled['container__inputWrap--span']}>Email 格式錯誤</span>
				)}
			</div>

			<div className={styled.container__inputWrap}>
				<label htmlFor=''>名稱</label>
				<input
					type='text'
					placeholder='Nickname'
					{...register('Nickname', { required: true, maxLength: 50 })}
					className={styled['container__inputWrap--input']}
				/>
				{errors.Nickname && (
					<span className={styled['container__inputWrap--span']}>名稱不可空白</span>
				)}
			</div>

			<input type='submit' value={'確認送出'} className={styled.container__submit} />
		</form>
	);
}

function PasswordInput() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<PasswordData>();

	const onSubmit = (data: PasswordData) => console.log(data);

	const password = watch('Password'); // 監視「密碼」字段的值

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styled.container__formWrap}>
			<div className={styled.container__inputWrap}>
				<label htmlFor='password'>密碼</label>
				<input
					type='password'
					id='password'
					placeholder='Password'
					{...register('Password', { required: '密碼不可為空' })}
					className={styled['container__inputWrap--input']}
				/>
				{errors.Password && (
					<span className={styled['container__inputWrap--span']}>{errors.Password.message}</span>
				)}
			</div>

			<div className={styled.container__inputWrap}>
				<label htmlFor='confirmPassword'>確認密碼</label>
				<input
					type='password'
					id='confirmPassword'
					placeholder='passwordConfirm'
					{...register('ConfirmPassword', {
						required: '確認密碼不可為空',
						validate: (value) => value === password || '密碼和確認密碼不一致',
					})}
					className={styled['container__inputWrap--input']}
				/>
				{errors.ConfirmPassword && (
					<span className={styled['container__inputWrap--span']}>
						{errors.ConfirmPassword.message}
					</span>
				)}
			</div>

			<input type='submit' value={'確認送出'} className={styled.container__submit} />
		</form>
	);
}

function StoreAccount() {
	return (
		<div className={styled.container}>
			<div className={styled.container__wrap}>
				{/* email account */}
				<div className={styled['container__wrap--h2']}>
					<span>我的帳戶</span>
				</div>
				<div className={styled.container__titleWrap}>
					<BiSolidUser className={styled['container__titleWrap--icon']} />
					<span>基本資料</span>
				</div>
				<AccountInput />
				<div className={styled.container__line}></div>

				{/* password */}
				<div className={styled.container__titleWrap}>
					<span>修改密碼</span>
				</div>
				<PasswordInput />
			</div>
		</div>
	);
}

export default StoreAccount;
