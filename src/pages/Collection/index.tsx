import { useEffect, useState, ChangeEvent, MouseEvent, KeyboardEvent } from 'react';
import CardList from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import styled from './styles.module.scss';
import { fetchLikeStoresData } from '../../api/stores';
import { useStoresData } from '../../contexts/findContext';

function Collection() {
	const { likeStores, setLikeStores, filteredLike, setFilteredLike, setOneStore } = useStoresData();
	const [noLikeStores, setNoLikeStores] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		setSearchTerm(e.target.value);
	};

	const handleSearch = () => {
		if (searchTerm === '') {
			setFilteredLike(likeStores);
		} else {
			// 我的場館過濾
			const filteredLikedResults = likeStores.filter((item) =>
				item.storeName.toLowerCase().includes(searchTerm.toLowerCase()),
			);
			setFilteredLike(filteredLikedResults);
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

				// 取得收藏場館
				const result = await fetchLikeStoresData(authToken);

				// 判斷使用者有無收藏場館
				if (result) {
					if ('res' in result) {
						const { res, noLikeStores } = result;
						setLikeStores(res);
						setNoLikeStores(noLikeStores);
					}
				}
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
					handleInputChange={handleInputChange}
					handleKeyDown={handleKeyDown}
					handleSearchClick={handleSearchClick}
					searchTerm={searchTerm}
				/>
				{noLikeStores === 'error' && <div>目前沒有收藏任何場館!!</div>}
				{filteredLike.length <= 0 ? (
					likeStores && likeStores.length > 0 && <CardList data={likeStores} />
				) : (
					<CardList data={filteredLike} />
				)}
			</div>
		</div>
	);
}

export default Collection;
