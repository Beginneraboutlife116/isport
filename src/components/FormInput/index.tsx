import { ReactNode } from 'react';
import { RegisterOptions, UseFormRegister, FieldErrors, FieldValues } from 'react-hook-form';
import styles from './styles.module.scss';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import ConfirmPasswordInput from './ConfirmPasswordInput';

// TODO: Turn this input to a pure component!
export type FormInputProps<TFieldValues extends FieldValues = FieldValues> =
	React.InputHTMLAttributes<HTMLInputElement> & {
		name: string;
		label?: string;
		labelClassName?: string;
		errors?: FieldErrors<TFieldValues>;
		errorClassName?: string;
		inputClassName?: string;
		rules?: RegisterOptions;
		register: UseFormRegister<TFieldValues>;
	};

export default function FormInput({
	register,
	errors,
	errorClassName,
	label,
	labelClassName,
	inputClassName,
	rules,
	name,
	...props
}: FormInputProps) {
	const { className, type, id } = props;
	let errorMessage = null;
	if (errors) {
		errorMessage = errors[name]?.message;
	}

	return (
		<div className={`${styles.input} ${className ?? ''}`.trim()}>
			{label && (
				<label htmlFor={id} className={labelClassName}>
					{label}
				</label>
			)}
			<div data-input-wrapper>
				{errorMessage && (
					<p className={errorClassName} data-error-message>
						{errorMessage as ReactNode}
					</p>
				)}
				<input
					type={type ?? 'text'}
					{...props}
					{...register(name, rules)}
					className={inputClassName}
				/>
			</div>
		</div>
	);
}

export { EmailInput, PasswordInput, ConfirmPasswordInput };
