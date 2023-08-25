import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import { UseFormReset, FieldValues, UseFormSetError } from 'react-hook-form';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import { StoreType } from '../../components/Dialog/FormDialogWithImage';
import { CardData } from '../../components/CardList';
import { MapModal, FormDialogWithImage } from '../../components/Dialog';
import { getOwnerStores, getOneStore, createStore, updateStore } from '../../api/owner';
import { isAxiosError } from '../../util/helpers';
import useIntersectionObserver from '../../util/useIntersectionObserver';
import Card, { CardPlaceholder } from '../../components/Card';
import styled from './styles.module.scss';

export default function StoreFindPage() {
	const [toggleDialog, setToggleDialog] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [storesData, setStoresData] = useState<CardData[] | []>([]);
	const [filteredData, setFilteredData] = useState<CardData[] | []>([]);
	const [editingStore, setEditingStore] = useState<StoreType>();
	const [isPending, setIsPending] = useState(false);
	const [toggleMap, setToggleMap] = useState(false);
	const [storeMap, setStoreMap] = useState<{ address: string; storeName: string }>({
		address: '',
		storeName: '',
	});
	const [storesPage, setStoresPage] = useState<number>(0);
	const [hasMounted, setHasMounted] = useState<boolean>(false);
	const [hasMoreStores, setHasMoreStores] = useState<boolean>(true);
	const [noDataMessage, setNoDataMessage] = useState<string>('');
	const lastStoreRef = useIntersectionObserver(
		(entries) => {
			if (entries[0].isIntersecting && hasMoreStores) {
				setStoresPage(storesPage + 1);
			}
		},
		{
			rootMargin: '10px',
			threshold: 1,
		},
		hasMounted,
	);
	const STORES_PER_PAGE = 6;

	useEffect(() => {
		async function fetchOwnerStores() {
			try {
				setIsPending(true);
				const response = await getOwnerStores(storesPage, STORES_PER_PAGE);
				if (storesData.length) {
					setStoresData([...storesData, ...response.data]);
					setFilteredData([...filteredData, ...response.data]);
				} else {
					setStoresData(response.data);
					setFilteredData(response.data);
				}
			} catch (error) {
				if (isAxiosError(error)) {
					console.error(error);
					if (storesData.length) {
						setHasMoreStores(false);
					} else {
						setNoDataMessage(error.response?.data.message);
					}
				} else {
					console.error(error);
				}
			} finally {
				setIsPending(false);
			}
		}
		fetchOwnerStores();
	}, [storesPage]);

	useEffect(() => {
		setHasMounted(!isPending && filteredData.length !== 0);
	}, [isPending, filteredData]);

	function handleSearch() {
		if (searchTerm) {
			setFilteredData(storesData.filter((item) => item.storeName.includes(searchTerm)));
		} else {
			setFilteredData([...storesData]);
		}
	}

	function handleEdit(id: number) {
		fetchOneStore(id);
	}

	function handleOpenMap(id: number) {
		const storeForMap = filteredData.find((data) => data.id === id);
		if (storeForMap) {
			setStoreMap({ address: storeForMap.address, storeName: storeForMap.storeName });
		}
		setToggleMap(!toggleMap);
	}

	async function fetchOneStore(storeId: number) {
		try {
			const {
				data: { id, storeName, photo, address, introduction, email, phone },
			} = await getOneStore(storeId);
			const editingStore = {
				id,
				storeName,
				photo,
				address,
				introduction,
				email,
				phone,
			};
			setEditingStore(editingStore);
			setToggleDialog(!toggleDialog);
		} catch (error) {
			console.error(error);
		}
	}

	async function createStoreIntoStores(
		data: FormData,
		reset: UseFormReset<FieldValues>,
		setError: UseFormSetError<FieldValues>,
		setIsPending: Dispatch<SetStateAction<boolean>>,
	) {
		try {
			let fakePhoto = URL.createObjectURL(data.get('photo') as File);
			setIsPending(true);
			const response = await createStore(data);
			if (response.status === 200) {
				const fakeStore = {
					id: response.data.id,
					rating: 0,
					reviewCounts: 0,
					storeName: data.get('storeName') as string,
					address: data.get('address') as string,
					introduction: data.get('introduction') as string,
					photo: fakePhoto,
					lat: 0,
					lng: 0,
				};
				setStoresData([fakeStore, ...storesData]);
				if (searchTerm) {
					if ((data.get('storeName') as string).includes(searchTerm)) {
						setFilteredData([fakeStore, ...filteredData]);
					}
				} else {
					setFilteredData([fakeStore, ...filteredData]);
				}
				reset();
				setToggleDialog(!toggleDialog);
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

	async function editStoreIntoStores(
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
				storeName: data.get('storeName') as string,
				address: data.get('address') as string,
				introduction: data.get('introduction') as string,
				photo: fakePhoto,
			};
			if (response.status === 200) {
				setStoresData(
					storesData.map((store) => {
						if (store.id === storeId) {
							return { ...store, ...fakeStore };
						}
						return store;
					}),
				);
				if (searchTerm) {
					if ((data.get('storeName') as string).includes(searchTerm)) {
						setFilteredData(
							filteredData.map((store) => {
								if (store.id === storeId) {
									return { ...store, ...fakeStore };
								}
								return store;
							}),
						);
					}
				} else {
					setFilteredData(
						filteredData.map((store) => {
							if (store.id === storeId) {
								return { ...store, ...fakeStore };
							}
							return store;
						}),
					);
				}
				reset();
				setToggleDialog(!toggleDialog);
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
		<div className='container pt-32'>
			<div className={styled['dialog-wrapper']}>
				<SearchBar
					searchTerm={searchTerm}
					handleInputChange={(event) => setSearchTerm(event.target.value)}
					handleKeyDown={(event) => {
						if (event.keyCode !== 229 && event.key === 'Enter') {
							handleSearch();
						}
					}}
					handleSearchClick={handleSearch}
				/>
				<Button
					onClick={() => setToggleDialog(!toggleDialog)}
					className={styled['btn--openDialog']}
				>
					<BsPlusCircleFill />
				</Button>
				<FormDialogWithImage
					isOpen={toggleDialog}
					closeDialog={() => {
						setEditingStore(undefined);
						setToggleDialog(!toggleDialog);
					}}
					editingStore={editingStore}
					handleDialogSubmit={editingStore ? editStoreIntoStores : createStoreIntoStores}
					buttonText={editingStore ? '修改送出' : '送出'}
				/>
				<MapModal
					isOpen={toggleMap}
					closeDialog={() => setToggleMap(!toggleMap)}
					storeMap={storeMap}
				/>
			</div>
			<div className='even-columns'>
				{filteredData.length ? (
					filteredData.map((item, index) => {
						if ((index + 1) % (STORES_PER_PAGE * (storesPage + 1)) === 0) {
							return (
								<Card
									key={item.id}
									{...item}
									onClick={handleEdit}
									onOpenMap={handleOpenMap}
									ref={lastStoreRef}
								/>
							);
						} else {
							return (
								<Card key={item.id} {...item} onClick={handleEdit} onOpenMap={handleOpenMap} />
							);
						}
					})
				) : noDataMessage ? (
					<h2>{noDataMessage}</h2>
				) : null}
				{isPending
					? filteredData.length
						? new Array(3).fill(null).map(() => <CardPlaceholder key={crypto.randomUUID()} />)
						: new Array(STORES_PER_PAGE)
								.fill(null)
								.map(() => <CardPlaceholder key={crypto.randomUUID()} />)
					: null}
			</div>
		</div>
	);
}
