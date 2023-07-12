import React from 'react';
import { FieldValues, Validate, UseFormRegister } from 'react-hook-form';
import EmailInput from './EmailInput';
import styles from './styles.module.scss';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	register: UseFormRegister<FieldValues>;
	id: string;
	className?: string;
	errors?: { [key: string]: string };
	errorKey?: string;
	required: boolean;
	validate?: Validate<any, FieldValues>;
	label?: string;
};

export default function FormInput({
	register,
	errors,
	errorKey,
	required,
	validate,
	onBlur,
	onChange,
	id,
	className,
	label,
	...props
}: FormInputProps) {
	let errorMessage = null;
	if (errors && errorKey) {
		errorMessage = errors[errorKey];
	} else {
		errorMessage = null;
	}
	return (
		<div key={id} className={`${styles.input} ${className ?? ''}`.trim()}>
			{label && <label htmlFor={id}>{label}</label>}
			<div data-input-wrapper>
				{errorMessage && <p data-error-message>{errorMessage}</p>}
				<input type={props.type ?? 'text'} id={id} {...register(id, {required, validate, onBlur, onChange})} {...props} />
			</div>
		</div>
	);
}

export { EmailInput };
