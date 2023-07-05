import { Outlet } from 'react-router-dom';
import Nav from './components/Nav';

function App() {
	return (
		<div>
			<h1>This is app</h1>
			<Nav />
			<Outlet />
		</div>
	);
}

export default App;
