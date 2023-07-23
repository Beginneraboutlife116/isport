import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOneStore } from '../../api/owner';
import Card, { type CardProps } from '../../components/Card';
import Button from '../../components/Button';
import { useStoresData } from '../../contexts/findContext';
import styles from './styles.module.scss';
import FormDialogWithImage from '../../components/Dialog/FormDialogWithImage';
import { StoreType } from '../../components/Dialog/FormDialogWithImage';
import OwnerClasses from './OwnerClasses';

export default function OwnerStore() {
	const { storeId } = useParams();
	const { setOneStore } = useStoresData();
	const [currentNav, setCurrentNav] = useState('classes');
	const [toggleImgDialog, setToggleImgDialog] = useState(false);
	const [editingStore, setEditingStore] = useState<StoreType>();
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

		fetchStore();

		return () => {
			setOneStore(false);
		};
	}, []);

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
								onClick={() => setCurrentNav('classes')}
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
				{currentNav === 'classes' && <OwnerClasses />}
				{currentNav === 'plan' && <section>方案</section>}
				{currentNav === 'review' && <section>評價</section>}
			</div>
			<FormDialogWithImage
				isOpen={toggleImgDialog}
				closeDialog={() => {
					setEditingStore(undefined);
					setToggleImgDialog(!toggleImgDialog);
				}}
				editingStore={editingStore as StoreType}
				handleDialogSubmit={updateStore}
				buttonText='修改送出'
			/>
		</main>
	);
}

export { OwnerClasses };
