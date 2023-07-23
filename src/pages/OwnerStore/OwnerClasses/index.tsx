import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';
import { isAxiosError } from '../../../util/helpers';
import { getStoreClasses, deleteClass, createClass, updateClass } from '../../../api/owner';
import Button from '../../../components/Button';
import OwnerClass from '../../../components/OwnerClass';
import { DeleteModal, FormDialogForClass } from '../../../components/Dialog';
import storeStyles from '../styles.module.scss';
import styles from './styles.module.scss';
import { UseFormReset, FieldValues } from 'react-hook-form';

export type DayClassesType = {
	id: number;
	className: string;
	startTime: string;
	endTime: string;
	headcount: number;
};

export type ClassType = DayClassesType & {
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
	const [eachDayClasses, setEachDayClasses] = useState<{ [key: string]: DayClassesType[] }>({});
	const [noDataMessage, setNoDataMessage] = useState<string>('');
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
					const newData: { [key: string]: DayClassesType[] } = response.data.reduce(
						(accu: { [key: string]: DayClassesType[] }, curr: ClassType) => {
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
						{} as { [key: string]: DayClassesType[] },
					);
					setEachDayClasses(newData);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					setNoDataMessage(error.response?.data.message);
				}
				console.error(error);
			}
		}

		fetchClasses();
	}, []);

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

	async function createClassIntoStore(
		data: {
			weekDay: number;
			className: string;
			startTime: string;
			endTime: string;
			headcount: number;
		},
		reset: UseFormReset<FieldValues>,
	) {
		try {
			const response = await createClass(Number.parseInt(storeId as string, 10), {
				...data,
				weekDay: week[data.weekDay],
			});
			if (response.status === 200) {
				const { weekDay, className, startTime, endTime, headcount } = data;
				setEachDayClasses({
					...eachDayClasses,
					[weekDay]: eachDayClasses[weekDay].concat({
						id: response.data.id,
						className,
						startTime,
						endTime,
						headcount,
					}),
				});
				setToggleClassDialog(!toggleClassDialog);
				reset();
			}
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error);
			}
			console.error(error);
		}
	}

	async function updateClassIntoStore(
		data: {
			weekDay: number;
			className: string;
			startTime: string;
			endTime: string;
			headcount: number;
		},
		reset: UseFormReset<FieldValues>,
	) {
		try {
			const { weekDay } = data;
			const response = await updateClass({
				...data,
				id: editingClass?.id as number,
				weekDay: week[weekDay],
			});
			if (response.status === 200) {
				setEachDayClasses({
					...eachDayClasses,
					[editingClass?.weekDay as number]: eachDayClasses[editingClass?.weekDay as number].filter(
						(item) => item.id !== (editingClass?.id as number),
					),
				});
				setEachDayClasses((e) => ({
					...e,
					[weekDay]: [...e[weekDay], { ...data, id: editingClass?.id as number }],
				}));
				setToggleClassDialog(!toggleClassDialog);
				setEditingClass(undefined);
				reset();
			}
		} catch (error) {
			console.error(error);
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
				{noDataMessage ? (
					<p className={storeStyles.noData}>{noDataMessage}</p>
				) : (
					Object.entries(eachDayClasses).map(([key, value]) => (
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
					))
				)}
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
