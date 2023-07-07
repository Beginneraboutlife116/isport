import styled from './styles.module.scss';
import { FaSearch } from 'react-icons/fa';

function SearchBar() {
	return (
		<div className={styled.searchWrap}>
			<input type='text' placeholder='搜尋場館' className={styled.searchWrap_search} />
			<FaSearch className={styled.searchWrap_icon} />
		</div>
	);
}

export default SearchBar;
