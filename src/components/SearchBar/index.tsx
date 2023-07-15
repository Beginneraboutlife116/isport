import { ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import styled from './styles.module.scss';
import { FaSearch } from 'react-icons/fa';

interface SearchBarProps {
	searchTerm: string;
	handleInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
	handleKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
	handleSearchClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

function SearchBar({
	searchTerm,
	handleInputChange,
	handleKeyDown,
	handleSearchClick,
}: SearchBarProps) {
	return (
		<div className={styled.searchWrap}>
			<input
				type='text'
				placeholder='搜尋場館'
				value={searchTerm}
				className={styled.searchWrap_search}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
			/>
			<FaSearch className={styled.searchWrap_icon} onClick={handleSearchClick} />
		</div>
	);
}

export default SearchBar;
