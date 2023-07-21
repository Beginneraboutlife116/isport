import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsPlusCircleFill } from 'react-icons/bs';
import { getOneStore, getStoreClasses } from '../../api/owner';
import Card, { type CardProps } from '../../components/Card';
import Button from '../../components/Button';
import OwnerCourse from '../../components/Course/OwnerCourse';
import { useStoresData } from '../../contexts/findContext';
import styles from './styles.module.scss';

export default function OwnerStore() {
	const [currentNav, setCurrentNav] = useState('course');
	const [classes, setClasses] = useState([]);
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

		async function fetchClasses() {
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
			fetchClasses();
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
						<OwnerCourse />
					</section>
				)}
				{currentNav === 'plan' && <section>方案</section>}
				{currentNav === 'review' && <section>評價</section>}
			</div>
		</main>
	);
}
