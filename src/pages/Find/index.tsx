import { useEffect, useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import CardList from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import Loading from '../../components/Loading';
import { MapModal } from '../../components/Dialog';
// import styled from './styles.module.scss';
import { fetchStoresData } from '../../api/stores';
import { useStoresData } from '../../contexts/findContext';

function Find() {
	const { storesData, setStoresData, filteredData, setFilteredData, setOneStore } = useStoresData();
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [toggleMap, setToggleMap] = useState(false);
	const [storeMap, setStoreMap] = useState<{ address: string; storeName: string }>({
		address: '',
		storeName: '',
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setSearchTerm(e.target.value);
	};

	const handleSearch = () => {
		if (searchTerm === '') {
			setFilteredData(storesData);
		} else {
			// 找場館過濾
			const filteredResults = storesData.filter((item) =>
				item.storeName.toLowerCase().includes(searchTerm.toLowerCase()),
			);
			setFilteredData(filteredResults);
		}
	};

	const handleSearchClick = (e: MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		handleSearch();
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			handleSearch();
		}
	};

	const handleOpenMap = (id: number) => {
		const storeForMap = storesData.find((item) => item.id === id);
		if (storeForMap) {
			setStoreMap({ address: storeForMap.address, storeName: storeForMap.storeName });
			setToggleMap(!toggleMap);
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				setFilteredData([]);
				const storedData = localStorage.getItem('isport');
				let dataObject: { token?: string } = {};
				if (storedData) {
					dataObject = JSON.parse(storedData);
				}
				const authToken = dataObject.token;

				// 取得所有場館
				const res = await fetchStoresData(authToken || '');

				setStoresData(res);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
		setOneStore(false);
	}, []);
	return (
		<div className='pt-32'>
			<div className='container'>
				<SearchBar
					searchTerm={searchTerm}
					handleInputChange={handleInputChange}
					handleKeyDown={handleKeyDown}
					handleSearchClick={handleSearchClick}
				/>

				<MapModal
					isOpen={toggleMap}
					closeDialog={() => {
						setToggleMap(!toggleMap);
					}}
					storeMap={storeMap}
				/>

				{isLoading ? (
					// 旋轉動畫
					// <div className={styled.container__loading}></div>
					<Loading />
				) : filteredData.length <= 0 ? (
					<CardList data={storesData} handleOpenMap={handleOpenMap} />
				) : (
					<CardList data={filteredData} handleOpenMap={handleOpenMap} />
				)}
			</div>
		</div>
	);
}

export default Find;
