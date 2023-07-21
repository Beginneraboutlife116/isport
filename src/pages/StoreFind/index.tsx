import { useEffect, useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import CardList from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import FormDialogWithImage from '../../components/Dialog/FormDialogWithImage';
import { getOwnerStores, getOneStore } from '../../api/owner';
import { useStoresData } from '../../contexts/findContext';
import { isAxiosError } from '../../util/helpers';
import { StoreType } from '../../components/Dialog/FormDialogWithImage';
import styled from './styles.module.scss';

export default function StoreFindPage() {
	const [toggleDialog, setToggleDialog] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const { storesData, setStoresData, filteredData, setFilteredData } = useStoresData();
	const [editingStore, setEditingStore] = useState<StoreType | {}>({});

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
			setFilteredData(storesData);
		}
	}

	function handleEdit(id: number) {
		fetchOneStore(id);
	}

	async function fetchOneStore(storeId: number) {
		try {
			const { data } = await getOneStore(storeId);
			const editingStore = {
				id: data.id,
				storeName: data.storeName,
				photo: data.photo,
				address: data.address,
				introduction: data.introduction,
				email: data.email,
				phone: data.phone,
			};
			setEditingStore(editingStore);
			setToggleDialog(!toggleDialog);
		} catch (error) {
			console.error(error);
		}
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
					<Button onClick={() => setToggleDialog(!toggleDialog)} className={styled['btn--openDialog']}>
						<BsPlusCircleFill />
					</Button>

					<FormDialogWithImage
						isOpen={toggleDialog}
						closeDialog={() => {
							setEditingStore({});
							setToggleDialog(!toggleDialog);
						}}
						editingStore={editingStore as StoreType}
						updateFn={updateStores}
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
