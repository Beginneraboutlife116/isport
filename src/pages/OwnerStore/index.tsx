import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useParams } from 'react-router-dom';
import { UseFormReset, UseFormSetError, FieldValues } from 'react-hook-form';
import { isAxiosError } from '../../util/helpers';
import { getOneStore, updateStore } from '../../api/owner';
import { useStoresData } from '../../contexts/findContext';
import Card, { type CardProps } from '../../components/Card';
import Button from '../../components/Button';
import FormDialogWithImage, { StoreType } from '../../components/Dialog/FormDialogWithImage';
import OwnerClasses from './OwnerClasses';
import OwnerPlans from './OwnerPlans';
import OwnerReviews from './OwnerReviews';
import Loading from '../../components/Loading';
import styles from './styles.module.scss';

export default function OwnerStore() {
	const { storeId } = useParams();
	const { setOneStore } = useStoresData();
	const [currentNav, setCurrentNav] = useState('classes');
	const [toggleImgDialog, setToggleImgDialog] = useState(false);
	const [editingStore, setEditingStore] = useState<StoreType>();
	const [store, setStore] = useState<CardProps>();
	const [isPending, setIsPending] = useState(false);

	useEffect(() => {
		async function fetchStore() {
			try {
				setIsPending(true);
				const response = await getOneStore(Number.parseInt(storeId as string, 10));
				if (response.status === 200) {
					const { data } = response;
					setStore({
						id: data.id,
						storeName: data.storeName,
						rating: data.rating || 0,
						reviewCounts: data.reviewCounts || 0,
						introduction: data.introduction,
						photo: data.photo,
						address: data.address,
						email: data.email,
						phone: data.phone,
					} as CardProps);
					setOneStore(true);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setIsPending(false);
			}
		}

		fetchStore();

		return () => {
			setOneStore(false);
		};
	}, [storeId]);

	async function editStoreIntoStore(
		data: FormData,
		reset: UseFormReset<FieldValues>,
		setError: UseFormSetError<FieldValues>,
		setIsPending: Dispatch<SetStateAction<boolean>>,
	) {
		try {
			let fakePhoto = editingStore?.photo as string;
			if (data.has('photo')) {
				fakePhoto = URL.createObjectURL(data.get('photo') as File);
			}
			const storeId = editingStore?.id;
			setIsPending(true);
			const response = await updateStore(storeId as number, data);
			const fakeStore = {
				storeName: data.get('storeName'),
				address: data.get('address'),
				introduction: data.get('introduction'),
				photo: fakePhoto,
			};
			if (response.status === 200) {
				setStore({
					...store,
					...fakeStore,
				} as CardProps);
				reset();
				setToggleImgDialog(!toggleImgDialog);
				setEditingStore(undefined);
			}
		} catch (error) {
			if (isAxiosError(error) && error.response) {
				const { data } = error.response;
				const whichTypeInput = data.message.includes('地址') ? 'address' : 'storeName';
				setError(whichTypeInput, {
					type: data.status,
					message: data.message,
				});
			} else {
				console.error(error);
			}
		} finally {
			setIsPending(false);
		}
	}

	return (
		<main>
			<div className='container pt-32'>
				<div className={`${styles.container} mx-auto`}>
					{isPending ? (
						<Loading />
					) : (
						<Card
							{...(store as CardProps)}
							onClick={() => {
								setEditingStore({
									id: store?.id || 0,
									storeName: store?.storeName || '',
									introduction: store?.introduction || '',
									photo: store?.photo || '',
									address: store?.address || '',
									email: store?.email || '',
									phone: store?.phone || '',
								});
								setToggleImgDialog(!toggleImgDialog);
							}}
						/>
					)}
					<div className={styles.content}>
						<nav className={styles.nav}>
							<ul className={styles.nav__list}>
								<li>
									<Button
										onClick={() => setCurrentNav('classes')}
										className={styles.nav__btn}
										data-selected={currentNav === 'classes'}
									>
										每週課表
									</Button>
								</li>
								<li>
									<Button
										onClick={() => setCurrentNav('plans')}
										className={styles.nav__btn}
										data-selected={currentNav === 'plans'}
									>
										方案
									</Button>
								</li>
								<li>
									<Button
										onClick={() => setCurrentNav('reviews')}
										className={styles.nav__btn}
										data-selected={currentNav === 'reviews'}
									>
										評價
									</Button>
								</li>
							</ul>
						</nav>
						{currentNav === 'classes' && <OwnerClasses />}
						{currentNav === 'plans' && <OwnerPlans />}
						{currentNav === 'reviews' && <OwnerReviews />}
					</div>
					<FormDialogWithImage
						isOpen={toggleImgDialog}
						closeDialog={() => {
							setEditingStore(undefined);
							setToggleImgDialog(!toggleImgDialog);
						}}
						editingStore={editingStore}
						handleDialogSubmit={editStoreIntoStore}
						buttonText='修改送出'
					/>
				</div>
			</div>
		</main>
	);
}

export { OwnerClasses };
