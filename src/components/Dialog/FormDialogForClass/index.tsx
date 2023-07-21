import { useEffect, useRef, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { NameInput } from '../../FormInput';
import Button from '../../Button';
import Dialog from '..';

type FormDialogForClassProps = {
	isOpen: boolean;
	closeDialog: Function;
};

export default function FormDialogForClass({ isOpen, closeDialog }: FormDialogForClassProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		formState: { errors, isValid, isSubmitting },
	} = useForm();
	const weekday = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

	useEffect(() => {
		const dialog = dialogRef.current;
		if (dialog) {
			if (isOpen && !dialog.open) {
				dialog.show();
			} else if (!isOpen) {
				dialog.close();
			}
		}
		return () => {
			if (dialog && dialog.open) {
				dialog.close();
			}
		};
	}, [isOpen]);

	return (
		<Dialog closeDialog={closeDialog} ref={dialogRef}>
			<form onSubmit={handleSubmit((data) => console.log(data))}>
				<select name='weekday' id='weekday'>
					{weekday.map((day, index) => (
						<option value={index} key={day}>
							{day}
						</option>
					))}
				</select>
				<NameInput
					register={register}
					errors={errors}
					name='className'
					label='課程名稱'
					setError={setError}
					clearErrors={clearErrors}
				/>
				<label>
					<span>名額</span>
					<input
						type='number'
						{...register('headCount', {
							required: true,
							onBlur: (event: React.FocusEvent<HTMLInputElement, Element>) => {
								const { target } = event;
								if (!target.value) {
									setError('headCount', { type: 'required', message: '名額 不可為空' });
								}
							},
						})}
					/>
					{errors['headCount'] && <p>{errors['headCount'].message as ReactNode}</p>}
				</label>
				<Button type='submit' disabled={!isValid}>
					建立課程
				</Button>
			</form>
		</Dialog>
	);
}
