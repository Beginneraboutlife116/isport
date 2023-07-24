import { useEffect, useRef, FocusEvent, ChangeEvent } from 'react';
import { useForm, FieldValues } from 'react-hook-form';
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
	} = useForm<FieldValues>({
		values: {
			planName: editingPlan?.planName || '',
			planType: editingPlan?.planType || '次數',
			planAmount: editingPlan?.planAmount || 1,
			price: editingPlan?.price || 0,
		},
	});

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

	let btnDisabled = false;
	if (editingPlan) {
		btnDisabled =
			!Object.values(dirtyFields).some((item) => item) || !isValid || isSubmitSuccessful;
	} else {
		btnDisabled = !isValid || isSubmitSuccessful;
	}

	return (
		<Dialog closeDialog={closeDialog} ref={dialogRef} key={editingPlan?.id || 0}>
			<form
				onSubmit={handleSubmit((data) => {
					const { planName, planType, planAmount, price } = data;
					handleDialogSubmit(
						{
							planName,
							planType,
							planAmount: Number.parseInt(planAmount, 10),
							price: Number.parseInt(price, 10),
						},
						reset,
					);
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
								setError('planAmount', {
									type: 'required',
									message: `${watch('planType')} 不可為空`,
								});
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
				<Button type='submit' className={styles['btn--submit']} disabled={btnDisabled}>
					{isSubmitSuccessful ? '送出中...' : buttonText}
				</Button>
			</form>
		</Dialog>
	);
}
