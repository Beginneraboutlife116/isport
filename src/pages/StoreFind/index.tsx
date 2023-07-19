import { useEffect, useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import { FieldValues } from 'react-hook-form';
import CardList, { type CardData } from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import FormDialogWithImage from '../../components/Dialog/FormDialogWithImage';
import { getOwnerStores, createStore } from '../../api/owner';
import { useStoresData } from '../../contexts/findContext';
import { isAxiosError } from '../../util/helpers';
import styled from './styles.module.scss';

export default function StoreFindPage() {
	const [toggleDialog, setToggleDialog] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const { storesData, setStoresData } = useStoresData();
	const [stores, setStores] = useState<CardData[] | []>([]);
	const [fetchStatus, setFetchStatus] = useState<{
		type: 'idle' | 'pending' | 'success' | 'error';
		error: { type: string; message: string } | null;
	}>({ type: 'idle', error: null });

	useEffect(() => {
		async function fetchOwnerStores() {
			try {
				const response = await getOwnerStores();
				setStoresData(response.data);
				setStores(response.data);
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
			setStores(storesData.filter((item) => item.storeName.includes(searchTerm)));
		} else {
			setStores(storesData);
		}
	}

	async function onDialogSubmit(data: FieldValues) {
		try {
			const formData = new FormData();
			const fakeStore: { [key: string]: unknown } = {};
			for (const [key, value] of Object.entries(data)) {
				if (key === 'photo') {
					const file = value[0];
					fakeStore[key] = URL.createObjectURL(file);
					formData.append(key, file);
				} else {
					formData.append(key, value);
					if (key !== 'email' && key !== 'phone') {
						fakeStore[key] = value;
					}
				}
			}
			setFetchStatus({ type: 'pending', error: null });
			const response = await createStore(formData);
			if (response.status === 200) {
				setToggleDialog(!toggleDialog);
				setFetchStatus({ type: 'success', error: null });
				fakeStore.id = response.data.id;
				fakeStore.rating = 0;
				fakeStore.reviewCounts = 0;
				setStoresData([...storesData, fakeStore]);
				if (searchTerm) {
					if ((fakeStore.storeName as string).includes(searchTerm)) {
						setStores([...stores, fakeStore as CardData]);
					}
				} else {
					setStores([...stores, fakeStore as CardData]);
				}
			}
		} catch (error) {
			if (isAxiosError(error)) {
				setFetchStatus({ type: 'error', error: error.response?.data });
			} else {
				console.error(error);
			}
		}
	}

	/**
	 * 按下個別卡片的編輯按鈕
	 * 需要去取得該卡片的資料
	 * 利用 id 去取得資訊，因為有一些資訊是在這一次 fetchOwnerStores 取不到的
	 * 取完得到資料後，可以先暫存在一個地方，可供使用者後續點擊使用，所以每次點擊都要先看有沒有該筆資料
	 * 就是要把該資料取出來，丟進 dialog
	 */

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

					<FormDialogWithImage
						status={toggleDialog}
						handleDialogToggle={setToggleDialog}
						onSubmit={onDialogSubmit}
						fetchStatus={fetchStatus}
					/>
				</div>
				{stores.length ? <CardList data={stores} /> : <h2 data-title='no store'>沒有建立之場館</h2>}
			</div>
		</div>
	);
}
