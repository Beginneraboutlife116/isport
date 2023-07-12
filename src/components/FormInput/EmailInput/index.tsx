import { useState } from 'react';
import { UseFormRegister, FieldValues } from 'react-hook-form';
import FormInput from '..';

type EmailInputProps = {
	register: UseFormRegister<FieldValues>;
	placeholder?: string;
	required: boolean;
	className?: string;
};

export default function EmailInput({
	register,
	placeholder,
	required,
	className,
}: EmailInputProps) {
	const [errorKey, setErrorKey] = useState('');

	const emailErrors = {
		empty: 'Email 不可為空',
		pattern: 'Email 格式不對',
		exist: 'Email 已重複註冊',
		notExist: 'Email 不存在',
		pass: '',
	};

	return (
		<FormInput
			register={register}
			id='email'
			placeholder={placeholder}
			errors={emailErrors}
			errorKey={errorKey}
			rules={{
				required,
				validate: {
					pattern: (v) => {
						const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
						if (!pattern.test(v)) {
							setErrorKey('pattern');
							return false;
						}
						setErrorKey('pass');
						return true;
					},
				},
				onBlur: (event) => {
					const { target } = event;
					if (target.value === '') {
						setErrorKey('empty');
					}
				},
				onChange: (event) => {
					const { target } = event;
					if (target.value !== '') {
						setErrorKey('pass');
					}
				},
			}}
			className={className}
		/>
	);
}
