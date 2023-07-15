import { useEffect, useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import CardList from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import styled from './styles.module.scss';
import { fetchStoresData } from '../../api/stores';
import { useStoresData } from '../../contexts/findContext';

function Find() {
	const { storesData, setStoresData, filteredData, setFilteredData } = useStoresData();
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
				const authToken =
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBleGFtcGxlLmNvbSIsImF2YXRhciI6Imh0dHBzOi8vaW1ndXIuY29tLzVPTDV3SnQucG5nIiwibmlja25hbWUiOiJ1c2VyMiIsInJvbGUiOiJ1c2VyIiwic3RvcmVOYW1lIjpudWxsLCJjcmVhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIzLTA3LTEwVDE3OjEyOjMwLjAwMFoiLCJpYXQiOjE2ODkyMzYwNTMsImV4cCI6MTY5MTgyODA1M30.ScuJmJpzQoO-95_VM_I7W-VUBnkaXXuWRjE2DsvzvkQ';

				// 取得所有場館
				const res = await fetchStoresData(authToken);

				setStoresData(res);
				setIsLoading(false);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
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
