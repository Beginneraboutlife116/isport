import { UseFormSetError, UseFormClearErrors, FieldValues } from 'react-hook-form';
import FormInput, { FormInputProps } from '..';

type PasswordInputProps = FormInputProps & {
	setError: UseFormSetError<FieldValues>;
	clearErrors: UseFormClearErrors<FieldValues>;
	name?: string;
};

export default function PasswordInput({
	setError,
	clearErrors,
	register,
	errors,
	name = 'password',
	...props
}: PasswordInputProps) {
	const rules = {
		required: true,
		onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				setError(name, { type: 'required', message: '密碼不可為空' });
			}
		},
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			const { target } = event;
			if (target.value !== '') {
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
