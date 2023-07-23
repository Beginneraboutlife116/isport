import { useEffect, useRef, FocusEvent, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import Dialog from '..';
import FormInput, { NameInput } from '../../FormInput';
import Button from '../../Button';
import { PlanType } from '../../../pages/OwnerStore/OwnerPlans';
import styles from '../styles.module.scss';

type FormDialogForPlanProps = {
	isOpen: boolean;
	buttonText: string;
	editingPlan?: PlanType;
	closeDialog: Function;
	handleDialogSubmit: Function;
};

export default function FormDialogForPlan({
	isOpen,
	buttonText,
	editingPlan,
	closeDialog,
	handleDialogSubmit,
}: FormDialogForPlanProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isValid, isSubmitSuccessful, dirtyFields },
		setError,
		clearErrors,
		reset,
		watch,
	} = useForm();

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
		<Dialog closeDialog={closeDialog} ref={dialogRef} key={editingPlan?.id || 0}>
			<form
				onSubmit={handleSubmit((data) => {
					console.log(data);
				})}
				className={styles.form}
			>
				<NameInput
					register={register}
					name='planName'
					errors={errors}
					setError={setError}
					clearErrors={clearErrors}
					label='方案名稱'
					labelClassName={styles.label}
				/>
				<select {...register('planType', { required: true })} className={styles.select}>
					<option value='次數'>次數方案</option>
					<option value='天數'>天數方案</option>
				</select>
				<FormInput
					labelClassName={styles.label}
					type='number'
					register={register}
					errors={errors}
					label={watch('planType')}
					name='planAmount'
					rules={{
						required: true,
						validate: { min: (v) => Number.parseInt(v, 10) > 0 },
						onBlur: (event: FocusEvent<HTMLInputElement, Element>) => {
							const { target } = event;
							if (!target.value) {
								setError('planAmount', { type: 'required', message: '次數/天數 不可為空' });
							}
						},
						onChange: (event: ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							if (Number.parseInt(target.value, 10) <= 0) {
								setError('planAmount', { type: 'min', message: '次數/天數 必須大於 0' });
							} else {
								clearErrors('planAmount');
							}
						},
					}}
				/>
				<FormInput
					labelClassName={styles.label}
					type='number'
					register={register}
					errors={errors}
					label='價錢'
					name='price'
					rules={{
						required: true,
						validate: { min: (v) => Number.parseInt(v, 10) > 0 },
						onBlur: (event: FocusEvent<HTMLInputElement, Element>) => {
							const { target } = event;
							if (!target.value) {
								setError('price', { type: 'required', message: '價錢 不可為空' });
							}
						},
						onChange: (event: ChangeEvent<HTMLInputElement>) => {
							const { target } = event;
							if (Number.parseInt(target.value, 10) <= 0) {
								setError('price', { type: 'min', message: '價錢 必須大於 0' });
							} else {
								clearErrors('price');
							}
						},
					}}
				/>
				<Button type='submit' className={styles['btn--submit']} disabled={!isValid}>
					{buttonText}
				</Button>
			</form>
		</Dialog>
	);
}
