import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';
import { getOneStore, getStoreClasses, deleteClass } from '../../api/owner';
import Card, { type CardProps } from '../../components/Card';
import Button from '../../components/Button';
import OwnerClass from '../../components/OwnerClass';
import { useStoresData } from '../../contexts/findContext';
import styles from './styles.module.scss';
import FormDialogWithImage from '../../components/Dialog/FormDialogWithImage';
import DeleteModal from '../../components/Dialog/DeleteModal';
import FormDialogForClass from '../../components/Dialog/FormDialogForClass';
import { StoreType } from '../../components/Dialog/FormDialogWithImage';
import { isAxiosError } from '../../util/helpers';

export type DayClassesType = {
	id: number;
	className: string;
	startTime: string;
	endTime: string;
	headCount: number;
};

type ClassType = DayClassesType & {
	weekDay: number;
};

export default function OwnerStore() {
	const [currentNav, setCurrentNav] = useState('course');
	const [toggleImgDialog, setToggleImgDialog] = useState(false);
	const [toggleDeleteModal, setToggleDeleteModal] = useState(false);
	const [classId, setClassId] = useState(0);
	const [error, setError] = useState('');
	const [editingStore, setEditingStore] = useState<StoreType | {}>({});
	const [store, setStore] = useState<CardProps>({
		id: 0,
		storeName: '',
		rating: 0,
		reviewCounts: 0,
		introduction: '',
		photo: '',
		address: '',
		email: '',
		phone: '',
	});
	const [classes, setClasses] = useState<ClassType[]>([]);
	const { storeId } = useParams();
	const { setOneStore } = useStoresData();
	const eachDayClasses: { [key: string]: DayClassesType[] } = classes.reduce(
		(accu: { [key: string]: DayClassesType[] }, curr: ClassType) => {
			if (!accu[curr.weekDay]) {
				accu[curr.weekDay] = [
					{
						id: curr.id,
						className: curr.className,
						startTime: curr.startTime,
						endTime: curr.endTime,
						headCount: curr.headCount,
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
						headCount: curr.headCount,
					},
				];
			}
			return accu;
		},
		{} as { [key: string]: DayClassesType[] },
	);

	function updateStore({ storeName, introduction, photo, address, email, phone }: StoreType) {
		setStore({
			...store,
			storeName,
			introduction,
			photo,
			address,
			email,
			phone,
		});
	}

	async function deleteClassById(classId: number) {
		try {
			const response = await deleteClass(classId);
			if (response.status === 200) {
				setClasses(classes.filter((item) => item.id !== classId));
				setToggleDeleteModal(false);
			}
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		async function fetchStore() {
			try {
				const response = await getOneStore(Number.parseInt(storeId as string, 10));
				if (response.status === 200) {
					setStore(response.data);
					setOneStore(true);
				}
			} catch (error) {
				console.error(error);
			}
		}

		async function fetchCourses() {
			try {
				const response = await getStoreClasses(Number.parseInt(storeId as string, 10));
				if (response.status === 200) {
					setClasses(response.data);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					setError(error.response?.data.message);
				}
				console.error(error);
			}
		}

		if (store.id === 0) {
			fetchStore();
			fetchCourses();
		}

		return () => {
			setOneStore(false);
		};
	}, []);

	return (
		<main className={styles.container}>
			<Card
				{...store}
				onClick={() => {
					setEditingStore({
						id: store.id,
						storeName: store.storeName,
						introduction: store.introduction,
						photo: store.photo,
						address: store.address || '',
						email: store.email || '',
						phone: store.phone || '',
					});
					setToggleImgDialog(!toggleImgDialog);
				}}
			/>
			<div className={styles.content}>
				<nav className={styles.nav}>
					<ul className={styles.nav__list}>
						<li>
							<Button
								onClick={() => setCurrentNav('course')}
								className={styles.nav__btn}
								data-selected={currentNav === 'course'}
							>
								每週課表
							</Button>
						</li>
						<li>
							<Button
								onClick={() => setCurrentNav('plan')}
								className={styles.nav__btn}
								data-selected={currentNav === 'plan'}
							>
								方案
							</Button>
						</li>
						<li>
							<Button
								onClick={() => setCurrentNav('review')}
								className={styles.nav__btn}
								data-selected={currentNav === 'review'}
							>
								評價
							</Button>
						</li>
					</ul>
				</nav>
				<Button type='button' className={styles.modal__btn}>
					<BsPlusCircleFill />
				</Button>
				{currentNav === 'course' && (
					<section>
						{error ? (
							<p className={styles.noData}>{error}</p>
						) : (
							Object.entries(eachDayClasses).map(([key, value]) => (
								<OwnerClass
									key={key}
									eachDayClasses={value}
									weekday={key}
									openDeleteModal={(id) => {
										setToggleDeleteModal(true);
										setClassId(id);
									}}
								/>
							))
						)}
					</section>
				)}
				{currentNav === 'plan' && <section>方案</section>}
				{currentNav === 'review' && <section>評價</section>}
			</div>
			<FormDialogWithImage
				isOpen={toggleImgDialog}
				closeDialog={() => {
					setEditingStore({});
					setToggleImgDialog(!toggleImgDialog);
				}}
				editingStore={editingStore as StoreType}
				updateFn={updateStore}
			/>
			<DeleteModal
				isOpen={toggleDeleteModal}
				closeDialog={() => setToggleDeleteModal(false)}
				handleDelete={() => deleteClassById(classId)}
			/>
			<FormDialogForClass isOpen={true} />
		</main>
	);
}
