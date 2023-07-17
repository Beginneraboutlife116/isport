import { useEffect, useState } from 'react';
import styled from './styles.module.scss';
import { useForm, SubmitHandler } from 'react-hook-form';
import { BiSolidUser } from 'react-icons/bi';
import { editOwnerAccount, editOwnerPassword, fetchOwnerAccount } from '../../api/ownerAccount';

type FormData = {
	email: string;
	storeName: string;
};

type PasswordData = {
	password: string;
	confirmPassword: string;
};

function AccountInput({ email, storeName }: FormData) {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>();

	const [success, setSuccess] = useState(false);
	const [text, setText] = useState('');
	// 更新帳戶資料
	const onSubmit: SubmitHandler<FormData> = async (data) => {
		const storedData = localStorage.getItem('isport');
		let dataObject: { token?: string } = {};
		if (storedData) {
			dataObject = JSON.parse(storedData);
		}
		const authToken = dataObject.token;
		await editOwnerAccount(authToken || '', data.email, data.storeName);
		setSuccess(true);
		setText('更新成功!');

		setTimeout(() => {
			setText('');
		}, 1500);
	};

	useEffect(() => {
		setValue('email', email);
		setValue('storeName', storeName);
	}, [email, storeName, setValue]);
	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styled.container__formWrap}>
			<div className={styled.container__inputWrap}>
				<label htmlFor=''>Email</label>
				<input
					type='email'
					{...register('email', { required: true, pattern: /^\S+@\S+$/i })}
					className={styled['container__inputWrap--input']}
				/>
				{errors.email && (
					<span className={styled['container__inputWrap--span']}>Email 格式錯誤</span>
				)}
			</div>

			<div className={styled.container__inputWrap}>
				<label htmlFor=''>名稱</label>
				<input
					type='text'
					{...register('storeName', { required: true, maxLength: 50 })}
					className={styled['container__inputWrap--input']}
				/>
				{errors.storeName && (
					<span className={styled['container__inputWrap--span']}>名稱不可空白</span>
				)}
			</div>

			<input type='submit' value={'確認送出'} className={styled.container__submit} />
			{success ? <span className={styled.container__text}>{text}</span> : ''}
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
	const [success, setSuccess] = useState(false);
	const [text, setText] = useState('');

	const onSubmit = async (data: PasswordData) => {
		console.log(data);
		const storedData = localStorage.getItem('isport');
		let dataObject: { token?: string } = {};
		if (storedData) {
			dataObject = JSON.parse(storedData);
		}
		const authToken = dataObject.token;
		await editOwnerPassword(authToken || '', data.password, data.confirmPassword);

		setSuccess(true);
		setText('更新成功!');

		setTimeout(() => {
			setText('');
		}, 1500);
	};

	const password = watch('password'); // 監視「密碼」字段的值

	return (
		<form onSubmit={handleSubmit(onSubmit)} className={styled.container__formWrap}>
			<div className={styled.container__inputWrap}>
				<label htmlFor='password'>密碼</label>
				<input
					type='password'
					id='password'
					{...register('password', { required: '密碼不可為空' })}
					className={styled['container__inputWrap--input']}
				/>
				{errors.password && (
					<span className={styled['container__inputWrap--span']}>{errors.password.message}</span>
				)}
			</div>

			<div className={styled.container__inputWrap}>
				<label htmlFor='confirmPassword'>確認密碼</label>
				<input
					type='password'
					id='confirmPassword'
					{...register('confirmPassword', {
						required: '確認密碼不可為空',
						validate: (value) => value === password || '密碼和確認密碼不一致',
					})}
					className={styled['container__inputWrap--input']}
				/>
				{errors.confirmPassword && (
					<span className={styled['container__inputWrap--span']}>
						{errors.confirmPassword.message}
					</span>
				)}
			</div>

			<input type='submit' value={'確認送出'} className={styled.container__submit} />
			{success ? <span className={styled.container__text}>{text}</span> : ''}
		</form>
	);
}

function StoreAccount() {
	const [account, setAccount] = useState<FormData | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const storedData = localStorage.getItem('isport');
				let dataObject: { token?: string } = {};
				if (storedData) {
					dataObject = JSON.parse(storedData);
				}
				const authToken = dataObject.token;
				const res = await fetchOwnerAccount(authToken || '');
				setAccount(res);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, []);

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
				<AccountInput
					email={account ? account.email : ''}
					storeName={account ? account.storeName : ''}
				/>
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
