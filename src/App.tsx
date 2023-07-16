import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { FindProvider } from './contexts/findContext';
import { useAuth } from './contexts/authContext';
import { getUserData } from './api/user';

function App() {
	// ? 不確定將邏輯寫在這邊是不是可以的？
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [auth, setAuth] = useAuth();

	useEffect(() => {
		async function authorizeUser() {
			try {
				const localToken = localStorage.getItem('token') || '';
				if (localToken) {
					if (!auth.token) {
						const response = await getUserData();
						if (response.status === 200) {
							localStorage.setItem('token', localToken);
							setAuth({ ...auth, token: localToken });
							if (response.data.hasOwnProperty('avatar')) {
								setAuth({
									...auth,
									avatar: response.data.avatar,
									userId: response.data.id,
									role: 'user',
									isAuthenticated: true,
								});
							} else {
								setAuth({
									...auth,
									avatar: '',
									userId: response.data.id,
									role: 'store',
									isAuthenticated: true,
								});
							}
						} else {
							handleLogout();
							throw new Error(response.data.message);
						}
					} else if (auth.token === localToken) {
						setAuth({ ...auth, isAuthenticated: true });
					} else {
						handleLogout();
					}
				} else {
					handleLogout();
				}
			} catch (error) {
				console.error(error);
			}
		}

		authorizeUser();
	}, [pathname]);

	function handleLogout() {
		localStorage.removeItem('token');
		setAuth({
			token: '',
			role: '',
			userId: 0,
			avatar: '',
			isAuthenticated: false,
		});
		navigate('/login');
	}

	return (
		<>
			<Header
				role={!auth.isAuthenticated ? '' : auth.role}
				avatar={auth.avatar}
				onLogout={handleLogout}
				currentUserId={auth.userId}
			/>
			<FindProvider>
				<Outlet />
			</FindProvider>
		</>
	);
}

export default App;
