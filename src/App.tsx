import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { FindProvider } from './contexts/findContext';

function App() {
	// If authentication is true, then return different children in Header.
	const isAuthenticated = true;
	let returnRole = 'user';

	return (
		<>
			<Header role={!isAuthenticated ? '' : returnRole} />
			<FindProvider>
				<Outlet />
			</FindProvider>
		</>
	);
}

export default App;
