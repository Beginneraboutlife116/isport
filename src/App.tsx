import { Outlet } from 'react-router-dom';
import { Header } from './components';

function App() {
	// If authentication is true, then return different children in Header.
	const children = null;
	return (
		<>
			<Header children={children} />
			<Outlet />
		</>
	);
}

export default App;
