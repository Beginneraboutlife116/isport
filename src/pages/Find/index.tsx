import { useEffect, useState, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import SearchBar from '../../components/SearchBar';
import { MapModal } from '../../components/Dialog';
import { fetchStoresData } from '../../api/stores';
import { useStoresData } from '../../contexts/findContext';
import Card, { CardPlaceholder } from '../../components/Card';
import useIntersectionObserver from '../../util/useIntersectionObserver';

function Find() {
	const {
		storesData,
		setStoresData,
		filteredData,
		setFilteredData,
		setOneStore,
		storesPage,
		setStoresPage,
		hasMoreStores,
		setHasMoreStores,
	} = useStoresData();
	const [isLoading, setIsLoading] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [toggleMap, setToggleMap] = useState(false);
	const [storeMap, setStoreMap] = useState<{ address: string; storeName: string }>({
		address: '',
		storeName: '',
	});
	const [hasMounted, setHasMounted] = useState<boolean>(false);
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

	const STORES_PER_PAGE = 9;

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

				setIsLoading(true);
				// 取得所有場館
				if (hasMoreStores) {
					const res = await fetchStoresData(authToken || '', storesPage, STORES_PER_PAGE);
					if (storesData.length === 0 && hasMoreStores) {
						setStoresData(res);
					} else if (storesData.length !== 0 && hasMoreStores) {
						setStoresData([...storesData, ...res]);
					}
					if (res.length < STORES_PER_PAGE) {
						setHasMoreStores(false);
					}
				}
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
		setOneStore(false);
	}, [storesPage, STORES_PER_PAGE]);

	useEffect(() => {
		setHasMounted(!isLoading && storesData.length !== 0);
	}, [isLoading]);

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

				<div className='even-columns'>
					{filteredData.length
						? filteredData.map((item, index) => {
								if ((index + 1) % (STORES_PER_PAGE * (storesPage + 1)) === 0) {
									return (
										<Card key={item.id} {...item} onOpenMap={handleOpenMap} ref={lastStoreRef} />
									);
								} else {
									return <Card key={item.id} {...item} onOpenMap={handleOpenMap} />;
								}
						  })
						: storesData.map((item, index) => {
								if ((index + 1) % (STORES_PER_PAGE * (storesPage + 1)) === 0) {
									return (
										<Card key={item.id} {...item} onOpenMap={handleOpenMap} ref={lastStoreRef} />
									);
								} else {
									return <Card key={item.id} {...item} onOpenMap={handleOpenMap} />;
								}
						  })}
					{isLoading
						? storesData.length
							? new Array(3).fill(null).map(() => <CardPlaceholder key={crypto.randomUUID()} />)
							: new Array(STORES_PER_PAGE)
									.fill(null)
									.map(() => <CardPlaceholder key={crypto.randomUUID()} />)
						: null}
				</div>
			</div>
		</div>
	);
}

export default Find;
