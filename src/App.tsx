import { Outlet } from 'react-router-dom';
import Header from './components/Header';

function App() {
	// If authentication is true, then return different children in Header.
	const isAuthenticated = true;
	let returnRole = 'user';
	return (
		<>
			<Header role={!isAuthenticated ? undefined : returnRole} />
			<Outlet />
		</>
	);
}

export default App;
