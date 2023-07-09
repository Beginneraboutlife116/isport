import React from 'react';
import { FieldValues, RegisterOptions, UseFormRegister } from 'react-hook-form';
import styles from './styles.module.scss';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	register: UseFormRegister<FieldValues>;
	id: string;
	className?: string;
	errors?: { [key: string]: string };
	errorKey?: string;
	rules: RegisterOptions<FieldValues>;
	label?: string;
};

/**
 * Renders an input component.
 *
 * @param {InputProps} props - The props object containing the input component's properties. In rules, if you want to use `validate` followed by react hook form, you need to pass the validate object. In each property, you must return `true` or `false` for the `isValid` in formState.
 * @return {JSX.Element} The rendered input component.
 */
export default function Input({
	register,
	errors,
	errorKey,
	rules,
	id,
	className,
	label,
	...props
}: InputProps) {
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
