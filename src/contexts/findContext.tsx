import { createContext, useContext, useState, ReactNode } from 'react';

interface FindContextProps {
	storesData: any[];
	setStoresData: React.Dispatch<React.SetStateAction<any[]>>;
	filteredData: any[];
	setFilteredData: React.Dispatch<React.SetStateAction<any[]>>;
	likeStores: any[];
	setLikeStores: React.Dispatch<React.SetStateAction<any[]>>;
	filteredLike: any[];
	setFilteredLike: React.Dispatch<React.SetStateAction<any[]>>;
	oneStore: boolean;
	setOneStore: React.Dispatch<React.SetStateAction<boolean>>;
}

const FindContext = createContext<FindContextProps>({
	storesData: [],
	setStoresData: () => {},
	filteredData: [],
	setFilteredData: () => {},
	likeStores: [],
	setLikeStores: () => {},
	filteredLike: [],
	setFilteredLike: () => {},
	oneStore: false,
	setOneStore: () => {},
});

export const FindProvider = ({ children }: { children: ReactNode }) => {
	const [storesData, setStoresData] = useState<any[]>([]);
	const [filteredData, setFilteredData] = useState<any[]>([]);
	const [likeStores, setLikeStores] = useState<any[]>([]);
	const [filteredLike, setFilteredLike] = useState<any[]>([]);
	const [oneStore, setOneStore] = useState(false);

	const value = {
		storesData,
		setStoresData,
		filteredData,
		setFilteredData,
		likeStores,
		setLikeStores,
		filteredLike,
		setFilteredLike,
		oneStore,
		setOneStore,
	};

	return <FindContext.Provider value={value}>{children}</FindContext.Provider>;
};

export const useStoresData = () => {
	const StoresData = useContext(FindContext);
	return StoresData;
};
