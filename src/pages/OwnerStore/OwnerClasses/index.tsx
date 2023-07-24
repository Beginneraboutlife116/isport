import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';
import { isAxiosError } from '../../../util/helpers';
import { getStoreClasses, deleteClass, createClass, updateClass } from '../../../api/owner';
import Button from '../../../components/Button';
import OwnerClass from '../../../components/Course/OwnerClass';
import { DeleteModal, FormDialogForClass } from '../../../components/Dialog';
import { timeToNum } from '../../../components/Dialog/FormDialogForClass';
import styles from '../styles.module.scss';
import { UseFormReset, FieldValues } from 'react-hook-form';

export type DayClassType = {
	id?: number;
	className: string;
	startTime: string;
	endTime: string;
	headcount: number;
};

export type ClassType = DayClassType & {
	weekDay: number;
};

type ConditionReturnFormDialogForClassProps = {
	isOpen: boolean;
	editingClass?: ClassType;
	closeDialog: Function;
	handleCreate: Function;
	handleEdit: Function;
};

function ConditionReturnFormDialogForClass({
	editingClass,
	handleCreate,
	handleEdit,
	isOpen,
	closeDialog,
}: ConditionReturnFormDialogForClassProps) {
	if (editingClass) {
		return (
			<FormDialogForClass
				handleDialogSubmit={handleEdit}
				isOpen={isOpen}
				editingClass={editingClass}
				closeDialog={closeDialog}
				buttonText='修改課程'
			/>
		);
	} else {
		return (
			<FormDialogForClass
				handleDialogSubmit={handleCreate}
				isOpen={isOpen}
				closeDialog={closeDialog}
				buttonText='建立課程'
			/>
		);
	}
}

export default function OwnerClasses() {
	const { storeId } = useParams();
	const [eachDayClasses, setEachDayClasses] = useState<{ [key: string]: DayClassType[] }>({
		'0': [],
		'1': [],
		'2': [],
		'3': [],
		'4': [],
		'5': [],
		'6': [],
	});
	const [classIdAndDay, setClassIdAndDay] = useState<[number, string]>([0, '']);
	const [toggleDeleteModal, setToggleDeleteModal] = useState<boolean>(false);
	const [toggleClassDialog, setToggleClassDialog] = useState<boolean>(false);
	const [editingClass, setEditingClass] = useState<ClassType>();
	const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

	useEffect(() => {
		async function fetchClasses() {
			try {
				const response = await getStoreClasses(Number.parseInt(storeId as string, 10));
				if (response.status === 200) {
					const newData: { [key: string]: DayClassType[] } = response.data.reduce(
						(accu: { [key: string]: DayClassType[] }, curr: ClassType) => {
							if (!accu[curr.weekDay]) {
								accu[curr.weekDay] = [
									{
										id: curr.id,
										className: curr.className,
										startTime: curr.startTime,
										endTime: curr.endTime,
										headcount: curr.headcount,
									},
								];
							} else {
								accu[curr.weekDay] = [
									...accu[curr.weekDay],
									{
										id: curr.id,
										className: curr.className,
										startTime: curr.startTime,
										endTime: curr.endTime,
										headcount: curr.headcount,
									},
								];
							}
							return accu;
						},
						{} as { [key: string]: DayClassType[] },
					);
					setEachDayClasses({ ...eachDayClasses, ...newData });
				}
			} catch (error) {
				if (isAxiosError(error)) {
					console.error(error);
				} else {
					console.error(error);
				}
			}
		}

		fetchClasses();
	}, [storeId]);

	async function deleteClassById() {
		try {
			const [classId, day] = classIdAndDay;
			const response = await deleteClass(classId);
			if (response.status === 200) {
				setEachDayClasses({
					...eachDayClasses,
					[day]: eachDayClasses[day].filter((item) => item.id !== classId),
				});
				setToggleDeleteModal(false);
				setClassIdAndDay([0, '']);
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function createClassIntoStore(data: ClassType, reset: UseFormReset<FieldValues>) {
		try {
			const response = await createClass(Number.parseInt(storeId as string, 10), {
				...data,
				weekDay: week[data.weekDay],
			});
			if (response.status === 200) {
				const { weekDay, className, startTime, endTime, headcount } = data;
				setEachDayClasses((e) => {
					const weekDayClasses = e[weekDay];
					if (weekDayClasses) {
						const newWeekDayClasses = [
							...weekDayClasses,
							{ id: response.data.id, className, startTime, endTime, headcount },
						].sort((a, b) => {
							const timeA = timeToNum(a.startTime);
							const timeB = timeToNum(b.startTime);
							if (timeA && timeB) {
								return timeA - timeB;
							} else {
								return 0;
							}
						});
						return {
							...e,
							[weekDay]: newWeekDayClasses,
						};
					} else {
						return {
							...e,
							[weekDay]: [{ id: response.data.id, className, startTime, endTime, headcount }],
						};
					}
				});
				setToggleClassDialog(!toggleClassDialog);
				reset();
			}
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error);
			} else {
				console.error(error);
			}
		}
	}

	async function updateClassIntoStore(data: ClassType) {
		try {
			const { weekDay } = data;
			const response = await updateClass({
				...data,
				id: editingClass?.id as number,
				weekDay: week[weekDay],
			});
			if (response.status === 200) {
				if (editingClass?.weekDay === weekDay) {
					setEachDayClasses({
						...eachDayClasses,
						[editingClass.weekDay as number]: eachDayClasses[editingClass.weekDay as number].map(
							(item) => {
								if (item.id === editingClass.id) {
									return { ...item, ...data };
								} else {
									return item;
								}
							},
						),
					});
				} else {
					setEachDayClasses((e) => {
						const weekDayClasses = e[weekDay];
						if (weekDayClasses) {
							const newWeekDayClasses = [...weekDayClasses, { ...editingClass, ...data }].sort(
								(a, b) => {
									const timeA = timeToNum(a.startTime);
									const timeB = timeToNum(b.startTime);
									if (timeA && timeB) {
										return timeA - timeB;
									} else {
										return 0;
									}
								},
							);
							return {
								...e,
								[editingClass?.weekDay as number]: e[editingClass?.weekDay as number].filter(
									(item) => item.id !== (editingClass?.id as number),
								),
								[weekDay]: newWeekDayClasses,
							};
						} else {
							return {
								...e,
								[weekDay]: [{ ...data, id: editingClass?.id as number }],
							};
						}
					});
				}
				setToggleClassDialog(!toggleClassDialog);
				setEditingClass(undefined);
			}
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error);
			} else {
				console.error(error);
			}
		}
	}

	return (
		<>
			<Button
				type='button'
				className={styles.btn__open}
				onClick={() => setToggleClassDialog(!toggleClassDialog)}
			>
				<BsPlusCircleFill />
			</Button>
			<section className={styles.section}>
				{Object.entries(eachDayClasses).map(([key, value]) => (
					<OwnerClass
						key={key}
						eachDayClasses={value}
						weekday={key}
						openDeleteModal={(id: number) => {
							setToggleDeleteModal(true);
							setClassIdAndDay([id, key]);
						}}
						openEditDialog={(id: number) => {
							setToggleClassDialog(true);
							setEditingClass({
								...eachDayClasses[key].find((data) => data.id === id),
								weekDay: Number.parseInt(key, 10),
							} as ClassType);
						}}
					/>
				))}
			</section>
			<DeleteModal
				isOpen={toggleDeleteModal}
				closeDialog={() => setToggleDeleteModal(false)}
				handleDelete={() => deleteClassById()}
			/>
			<ConditionReturnFormDialogForClass
				isOpen={toggleClassDialog}
				closeDialog={() => {
					setToggleClassDialog(!toggleClassDialog);
					setEditingClass(undefined);
				}}
				editingClass={editingClass}
				handleCreate={createClassIntoStore}
				handleEdit={updateClassIntoStore}
			/>
		</>
	);
}
