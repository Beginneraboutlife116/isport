import { UseFormSetError, UseFormClearErrors, FieldValues } from 'react-hook-form';
import FormInput, { FormInputProps } from '..';

type EmailInputProps = FormInputProps & {
	setError: UseFormSetError<FieldValues>;
	clearErrors: UseFormClearErrors<FieldValues>;
	name?: string;
};

export default function EmailInput({
	setError,
	clearErrors,
	register,
	errors,
	name = 'email',
	...props
}: EmailInputProps) {
	const rules = {
		required: true,
		pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
		onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				setError(name, { type: 'required', message: 'Email 不可為空' });
			}
		},
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			const { target } = event;
			const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
			if (!pattern.test(target.value)) {
				setError(name, { type: 'pattern', message: 'Email 格式錯誤' });
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
			type='email'
		/>
	);
}
