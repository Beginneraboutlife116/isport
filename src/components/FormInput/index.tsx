import { forwardRef, FocusEvent, ChangeEvent, InputHTMLAttributes } from 'react';
import { UseFormSetError, FieldValues, UseFormClearErrors, UseFormRegister } from 'react-hook-form';
import styles from './styles.module.scss';
// import NameInput from './NameInput';
// import PasswordInput from './PasswordInput';
// import ConfirmPasswordInput from './ConfirmPasswordInput';

export function handleOnBlur(name: string, setError: UseFormSetError<FieldValues>, label?: string) {
	return (event: FocusEvent<HTMLInputElement, Element>) => {
		const { target } = event;
		if (target.value === '') {
			const nameQuery: { [key: string]: string } = {
				email: 'Email',
				password: '密碼',
				confirmPassword: '確認密碼',
				name: '名稱',
				nickname: '暱稱',
				storeName: '商家名稱',
			};
			setError(name, { type: 'required', message: `${nameQuery[name] || label || ''} 不可為空` });
		}
	};
}

export type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
	label?: string;
	errorMessage?: string;
	labelClassName?: string;
	errorClassName?: string;
	inputClassName?: string;
};

export type DerivedInputProps = FormInputProps & {
	setError: UseFormSetError<FieldValues>;
	clearErrors: UseFormClearErrors<FieldValues>;
	register: UseFormRegister<FieldValues>;
};

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(function FormInput(
	{ label, errorMessage, errorClassName, labelClassName, inputClassName, ...props }: FormInputProps,
	ref,
) {
	const { className, id } = props;

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
						{errorMessage}
					</p>
				)}
				<input {...props} className={inputClassName} ref={ref} />
			</div>
		</div>
	);
});

function EmailInput({
	setError,
	clearErrors,
	register,
	name = 'email',
	...props
}: DerivedInputProps) {
	const rules = {
		required: true,
		pattern: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
		onBlur: handleOnBlur(name, setError),
		onChange: (event: ChangeEvent<HTMLInputElement>) => {
			const { target } = event;
			const pattern = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
			if (!pattern.test(target.value)) {
				setError(name, { type: 'pattern', message: 'Email 格式錯誤' });
			} else {
				clearErrors(name);
			}
		},
	};

	return <FormInput {...props} type='email' {...register(name, rules)} />;
}

function PasswordInput({
	setError,
	clearErrors,
	register,
	name = 'password',
	...props
}: DerivedInputProps) {
	const rules = {
		required: true,
		onBlur: handleOnBlur(name, setError),
		onChange: () => clearErrors(name),
	};
	return <FormInput {...props} type='password' {...register(name, rules)} />;
}

type ConfirmPasswordInputType = DerivedInputProps & {
	watchingPassword: string | null;
};

function ConfirmPasswordInput({
	setError,
	clearErrors,
	register,
	name = 'confirmPassword',
	watchingPassword,
	...props
}: ConfirmPasswordInputType) {
	const rules = {
		required: true,
		validate: {
			different: (v: string) => v === watchingPassword,
		},
		onBlur: handleOnBlur(name, setError),
		onChange: (event: ChangeEvent<HTMLInputElement>) => {
			const { target } = event;
			if (target.value !== watchingPassword) {
				setError(name, { type: 'different', message: '密碼不一致' });
			} else {
				clearErrors(name);
			}
		},
	};
	return <FormInput {...props} type='password' {...register(name, rules)} />;
}

function NameInput({
	setError,
	clearErrors,
	register,
	name = 'name',
	...props
}: DerivedInputProps) {
	const maxLength = props.maxLength ?? 50;
	const rules = {
		required: true,
		maxLength,
		onBlur: handleOnBlur(name, setError),
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
	return <FormInput {...props} {...register(name, rules)} />;
}

export default FormInput;
export { EmailInput, NameInput, PasswordInput, ConfirmPasswordInput };
