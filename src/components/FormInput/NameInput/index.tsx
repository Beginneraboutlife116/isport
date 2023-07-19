import FormInput, { FormInputProps } from '..';
import { type FieldValues, UseFormSetError, UseFormClearErrors } from 'react-hook-form';

type NameInputProps = FormInputProps & {
	setError: UseFormSetError<FieldValues>;
	clearErrors: UseFormClearErrors<FieldValues>;
	name: string;
	maxLength?: number;
};

export default function NameInput({
	setError,
	clearErrors,
	register,
	errors,
	name,
	maxLength = 50,
	...props
}: NameInputProps) {
	const rules = {
		required: true,
		maxLength: maxLength,
		onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => {
			const { target } = event;
			if (target.value === '') {
				setError(name, { type: 'required', message: `${props.label || '名稱'} 不可為空` });
			}
		},
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
			const { target } = event;
			if (target.value.length > maxLength) {
				setError(name, {
					type: 'maxLength',
					message: `${props.label || '名稱'} 不能大於 ${maxLength} 個字`,
				});
			} else {
				clearErrors(name);
			}
		},
	};
	return <FormInput {...props} register={register} errors={errors} name={name} rules={rules} />;
}
