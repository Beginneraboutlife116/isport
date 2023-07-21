import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';
import { getOneStore, getStoreClasses, deleteClass } from '../../api/owner';
import Card, { type CardProps } from '../../components/Card';
import Button from '../../components/Button';
import OwnerClass from '../../components/OwnerClass';
import { useStoresData } from '../../contexts/findContext';
import styles from './styles.module.scss';

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
	const [classes, setClasses] = useState<ClassType[] | []>([]);
	const { storeId } = useParams();
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
		{},
	);

	async function deleteClassById(id: number) {
		try {
			const response = await deleteClass(id);
			if (response.status === 200) {
				setClasses(classes.filter((item) => item.id !== id));
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
			<Card {...store} />
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
						{Object.entries(eachDayClasses).map(([key, value]) => (
							<OwnerClass
								key={key}
								eachDayClasses={value}
								weekday={key}
								handleDelete={deleteClassById}
							/>
						))}
					</section>
				)}
				{currentNav === 'plan' && <section>方案</section>}
				{currentNav === 'review' && <section>評價</section>}
			</div>
		</main>
	);
}
