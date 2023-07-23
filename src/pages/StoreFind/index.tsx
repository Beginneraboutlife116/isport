import { useEffect, useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import { UseFormReset, FieldValues, UseFormSetError } from 'react-hook-form';
import CardList from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
// import FormDialogWithImage from '../../components/Dialog/FormDialogWithImage';
import { FormDialogWithImage } from '../../components/Dialog';
import { getOwnerStores, getOneStore, createStore, updateStore } from '../../api/owner';
import { useStoresData } from '../../contexts/findContext';
import { isAxiosError } from '../../util/helpers';
// import { StoreType } from '../../components/Dialog/FormDialogWithImage';
import styled from './styles.module.scss';

type StoreType = {
	id: number;
	storeName: string;
	photo: string;
	address: string;
	email: string;
	phone: string;
	introduction: string;
};

type ConditionReturnFormDialogWithImageProps = {
	isOpen: boolean;
	editingStore?: StoreType;
	closeDialog: Function;
	handleCreate: Function;
	handleEdit: Function;
};

function ConditionReturnFormDialogWithImage({
	isOpen,
	closeDialog,
	editingStore,
	handleCreate,
	handleEdit,
}: ConditionReturnFormDialogWithImageProps) {
	if (editingStore) {
		return (
			<FormDialogWithImage
				isOpen={isOpen}
				closeDialog={closeDialog}
				editingStore={editingStore}
				handleDialogSubmit={handleEdit}
				buttonText='修改送出'
			/>
		);
	} else {
		return (
			<FormDialogWithImage
				isOpen={isOpen}
				closeDialog={closeDialog}
				handleDialogSubmit={handleCreate}
				buttonText='送出'
			/>
		);
	}
}

export default function StoreFindPage() {
	const [toggleDialog, setToggleDialog] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const { storesData, setStoresData, filteredData, setFilteredData } = useStoresData();
	const [editingStore, setEditingStore] = useState<StoreType>();

	useEffect(() => {
		async function fetchOwnerStores() {
			try {
				const response = await getOwnerStores();
				setStoresData(response.data);
				setFilteredData(response.data);
			} catch (error) {
				if (isAxiosError(error)) {
					console.error(error);
				} else {
					console.error(error);
				}
			}
		}
		fetchOwnerStores();
	}, []);

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
	) {
		try {
			let fakePhoto = URL.createObjectURL(data.get('photo') as File);
			const response = await createStore(data as FormData);
			if (response.status === 200) {
				const fakeStore = {
					id: response.data.id,
					rating: 0,
					reviewCounts: 0,
					storeName: data.get('storeName'),
					address: data.get('address'),
					introduction: data.get('introduction'),
					photo: fakePhoto,
				};
				setStoresData([...storesData, fakeStore]);
				if (searchTerm) {
					if ((data.get('storeName') as string).includes(searchTerm)) {
						setFilteredData([...filteredData, fakeStore]);
					}
				} else {
					setFilteredData([...filteredData, fakeStore]);
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
		}
	}

	async function editStoreIntoStores(data: FieldValues) {
		console.log(data);
		// try {
		// 	if (Object.values(dirtyFields).some((value) => value)) {
		// 		const formData = new FormData();
		// 		let fakePhoto: string = photo || '';
		// 		for (const [key, value] of Object.entries(data)) {
		// 			if (key === 'photo' && photoChanged) {
		// 				const file = data.photo[0];
		// 				formData.append(key, file);
		// 				fakePhoto = URL.createObjectURL(file);
		// 			}
		// 			formData.append(key, value);
		// 		}
		// 		setIsPending(true);
		// 		const response = await updateStore(id, formData);
		// 		if (response.status === 200) {
		// 			closeDialog();
		// 			handleDialogSubmit({ ...data, photo: fakePhoto, id });
		// 		}
		// 	}
		// } catch (error) {
		// 	console.error(error);
		// } finally {
		// 	setIsPending(false);
		// }
	}

	async function updateStores(data: StoreType) {
		const findStore = storesData.find((item) => item.id === data.id);
		if (findStore) {
			setStoresData(
				storesData.map((store) => {
					if (store.id === data.id) {
						return { ...store, ...data };
					}
					return store;
				}),
			);
			if (searchTerm) {
				if (data.storeName.includes(searchTerm)) {
					setFilteredData(
						filteredData.map((store) => {
							if (store.id === data.id) {
								return { ...store, ...data };
							}
							return store;
						}),
					);
				}
			} else {
				setFilteredData(
					filteredData.map((store) => {
						if (store.id === data.id) {
							return { ...store, ...data };
						}
						return store;
					}),
				);
			}
		} else {
			setStoresData([...storesData, data]);
			if (searchTerm) {
				if (data.storeName.includes(searchTerm)) {
					setFilteredData([...filteredData, data]);
				}
			} else {
				setFilteredData([...filteredData, data]);
			}
		}
	}

	return (
		<div className={styled.container}>
			<div className={styled.container__wrap}>
				<div className={styled.container__dialog}>
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

					{/* <FormDialogWithImage
						isOpen={toggleDialog}
						closeDialog={() => {
							setEditingStore(undefined);
							setToggleDialog(!toggleDialog);
						}}
						editingStore={editingStore as StoreType}
						handleDialogSubmit={updateStores}
					/> */}
					<ConditionReturnFormDialogWithImage
						isOpen={toggleDialog}
						closeDialog={() => {
							setEditingStore(undefined);
							setToggleDialog(!toggleDialog);
						}}
						editingStore={editingStore}
						handleCreate={createStoreIntoStores}
						handleEdit={editStoreIntoStores}
					/>
				</div>
				{filteredData.length ? (
					<CardList data={filteredData} handleClick={handleEdit} />
				) : (
					<h2 data-title='no store'>沒有建立之場館</h2>
				)}
			</div>
		</div>
	);
}
