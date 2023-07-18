import { useEffect, useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import CardList from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import styled from './styles.module.scss';
import FormDialogWithImage from '../../components/Dialog/FormDialogWithImage';
import { getOwnerStores } from '../../api/owner';
import { useStoresData } from '../../contexts/findContext';
import { isAxiosError } from '../../util/helpers';
import { FieldValues } from 'react-hook-form';

type StoreType = {
	id: number;
	storeName: string;
	photo: string;
	address: string;
	rating: number;
	reviewCounts: number;
	introduction: string;
	isLiked?: boolean;
};

export default function StoreFindPage() {
	const [toggleDialog, setToggleDialog] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const { storesData, setStoresData } = useStoresData();
	const [stores, setStores] = useState<StoreType[] | []>([]);

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
						buttonDescription='送出'
					/>
				</div>
				{stores.length ? <CardList data={stores} /> : <h2 data-title="no store">沒有建立之場館</h2>}
			</div>
		</div>
	);
}
