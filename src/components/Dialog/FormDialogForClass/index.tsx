import { useEffect, useRef, ReactNode, ChangeEvent, FocusEvent } from 'react';
import { useForm, Controller, FieldValues } from 'react-hook-form';
import * as Slider from '@radix-ui/react-slider';
import { NameInput } from '../../FormInput';
import { ClassType } from '../../../pages/OwnerStore/OwnerClasses';
import Button from '../../Button';
import Dialog from '..';
import styles from './styles.module.scss';

type FormDialogForClassProps = {
	isOpen: boolean;
	closeDialog: Function;
	handleDialogSubmit: Function;
	editingClass?: ClassType;
	buttonText: string;
};

export default function FormDialogForClass({
	isOpen,
	closeDialog,
	handleDialogSubmit,
	editingClass,
	buttonText,
}: FormDialogForClassProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		clearErrors,
		control,
		watch,
		formState: { errors, isValid, dirtyFields, isSubmitSuccessful },
	} = useForm<FieldValues>({
		values: {
			weekDay: editingClass?.weekDay || 0,
			time: [timeToNum(editingClass?.startTime) || 16, timeToNum(editingClass?.endTime) || 42],
			headcount: editingClass?.headcount || 1,
			className: editingClass?.className || '',
		},
	});
	const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

	function timeToNum(str: string | undefined): number | undefined {
		if (!str) return undefined;
		const strArr = str.split(':');
		return Number.parseInt(strArr[0], 10) * 2 + (strArr[1] === '30' ? 1 : 0);
	}

	function numToTime(num: number): string {
		const hour = Math.floor(num / 2).toString();
		const minute = num % 2 ? '30' : '00';
		return `${hour.padStart(2, '0')}:${minute}`;
	}

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
	if (editingClass) {
		btnDisabled =
			!Object.values(dirtyFields).some((item) => item) || !isValid || isSubmitSuccessful;
	} else {
		btnDisabled = !isValid || isSubmitSuccessful;
	}

	return (
		<Dialog closeDialog={closeDialog} ref={dialogRef} key={editingClass?.id || 0}>
			<form
				onSubmit={handleSubmit((data) => {
					const { headcount, className, weekDay, time } = data;
					const startTime = numToTime(Math.min(...time));
					const endTime = numToTime(Math.max(...time));
					handleDialogSubmit(
						{
							headcount,
							className,
							weekDay,
							startTime,
							endTime,
						},
						reset,
					);
				})}
				className={styles.form}
			>
				<select className={styles.select} {...register('weekDay', { required: true })}>
					{week.map((day, index) => (
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
				<label className={styles.label}>
					<span>名額</span>
					{errors['headcount'] && (
						<p className={styles.error}>{errors['headcount'].message as ReactNode}</p>
					)}
					<input
						type='number'
						{...register('headcount', {
							required: true,
							validate: { min: (v) => Number.parseInt(v, 10) > 0 },
							onBlur: (event: FocusEvent<HTMLInputElement, Element>) => {
								const { target } = event;
								if (!target.value) {
									setError('headcount', { type: 'required', message: '名額 不可為空' });
								}
							},
							onChange: (event: ChangeEvent<HTMLInputElement>) => {
								const { target } = event;
								if (Number.parseInt(target.value, 10) <= 0) {
									setError('headcount', { type: 'min', message: '名額 必須大於 0' });
								} else {
									clearErrors('headcount');
								}
							},
						})}
					/>
				</label>
				<Controller
					control={control}
					name='time'
					render={({ field }) => (
						<Slider.Root
							className={styles.slider__root}
							min={0}
							max={48}
							step={1}
							minStepsBetweenThumbs={1}
							onValueChange={field.onChange}
							value={field.value}
						>
							<Slider.Track className={styles.slider__track}>
								<Slider.Range className={styles.slider__range} />
							</Slider.Track>
							<Slider.Thumb className={styles.slider__thumb} />
							<Slider.Thumb className={styles.slider__thumb} />
							<ul className={styles.slider__mark}>
								<li>0</li>
								<li>6</li>
								<li>12</li>
								<li>18</li>
								<li>24</li>
							</ul>
						</Slider.Root>
					)}
				/>
				<p className={styles.time}>
					<span>{numToTime(Math.min(...watch('time')))}</span> ~{' '}
					<span>{numToTime(Math.max(...watch('time')))}</span>
				</p>
				<Button type='submit' disabled={btnDisabled} className={styles['btn--submit']}>
					{isSubmitSuccessful ? '送出中...' : buttonText}
				</Button>
			</form>
		</Dialog>
	);
}
