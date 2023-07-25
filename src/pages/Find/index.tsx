import { useEffect, useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import CardList from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import styled from './styles.module.scss';
import { fetchStoresData } from '../../api/stores';
import { useStoresData } from '../../contexts/findContext';

function Find() {
	const { storesData, setStoresData, filteredData, setFilteredData, setOneStore } = useStoresData();
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');

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
		<div className={styled.container}>
			<div className={styled.container__wrap}>
				<SearchBar
					searchTerm={searchTerm}
					handleInputChange={handleInputChange}
					handleKeyDown={handleKeyDown}
					handleSearchClick={handleSearchClick}
				/>

				{isLoading ? (
					// 旋轉動畫
					<div className={styled.container__loading}></div>
				) : filteredData.length <= 0 ? (
					<CardList data={storesData} />
				) : (
					<CardList data={filteredData} />
				)}
			</div>
		</div>
	);
}

export default Find;
