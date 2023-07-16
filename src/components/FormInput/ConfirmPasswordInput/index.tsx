import { UseFormSetError, UseFormClearErrors, FieldValues } from 'react-hook-form';
import FormInput, { FormInputProps } from '..';

type PasswordInputProps = FormInputProps & {
	setError: UseFormSetError<FieldValues>;
	clearErrors: UseFormClearErrors<FieldValues>;
	watchingPassword: string;
	name?: string;
};

export default function ConfirmPasswordInput({
	setError,
	clearErrors,
	register,
	errors,
	name = 'confirmPassword',
	watchingPassword,
	...props
}: PasswordInputProps) {
	const rules = {
		required: true,
		validate: {
			different: (v: string) => v === watchingPassword,
		},
		onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				setError(name, { type: 'required', message: '確認密碼不可為空' });
			}
		},
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			const { target } = event;
			if (target.value !== watchingPassword) {
				setError(name, { type: 'different', message: '密碼不一致' });
			} else {
				clearErrors(name);
			}
		},
	};
	return (
		<FormInput
			{...props}
			name={name}
			register={register}
			errors={errors}
			rules={rules}
			type='password'
		/>
	);
}
