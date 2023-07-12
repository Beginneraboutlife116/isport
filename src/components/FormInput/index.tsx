import React from 'react';
import { FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';
import EmailInput from './EmailInput';
import styles from './styles.module.scss';

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	register: UseFormRegister<FieldValues>;
	id: string;
	className?: string;
	errors?: { [key: string]: string };
	errorKey?: string;
	rules?: RegisterOptions<FieldValues>;
	label?: string;
};

export default function FormInput({
	register,
	errors,
	errorKey,
	rules,
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
				<input type={props.type ?? 'text'} id={id} {...register(id, { ...rules })} {...props} />
			</div>
		</div>
	);
}

export { EmailInput };
