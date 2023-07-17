import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { FindProvider } from './contexts/findContext';
import { useAuth } from './contexts/authContext';
import { getUserData } from './api/user';
import { getOwnerData } from './api/owner';

function App() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [auth, setAuth] = useAuth();

	useEffect(() => {
		async function authorizeUser() {
			try {
				const isport = localStorage.getItem('isport');
				if (!isport) {
					handleLogout();
				} else {
					const { token: localToken, role } = JSON.parse(isport);
					if (localToken) {
						if (!auth.token) {
							const response = role === 'user' ? await getUserData() : await getOwnerData();
							if (response.status === 200) {
								const { id, email } = response.data;
								if (response.data.hasOwnProperty('avatar')) {
									setAuth({
										name: response.data.nickname,
										email,
										token: localToken,
										avatar: response.data.avatar,
										userId: id,
										role: 'user',
										isAuthenticated: true,
									});
									navigateToRoleDefaultPage(pathname, 'user', id);
								} else {
									setAuth({
										name: response.data.storeName,
										email,
										token: localToken,
										avatar: '',
										userId: id,
										role: 'owner',
										isAuthenticated: true,
									});
									navigateToRoleDefaultPage(pathname, 'owner', id);
								}
							} else {
								handleLogout();
								throw new Error(response.data.message);
							}
						} else if (auth.token === localToken) {
							setAuth({ ...auth, isAuthenticated: true });
							navigateToRoleDefaultPage(pathname, auth.role, auth.userId);
						} else {
							handleLogout();
						}
					} else {
						handleLogout();
					}
				}
			} catch (error) {
				console.error(error);
			}
		}

		authorizeUser();
	}, [pathname]);

	function handleLogout() {
		localStorage.removeItem('isport');
		setAuth({
			name: '',
			email: '',
			token: '',
			role: '',
			userId: 0,
			avatar: '',
			isAuthenticated: false,
		});
		navigateToLogin(pathname);
	}

	function navigateToLogin(pathname: string) {
		if (
			pathname !== '/login' &&
			pathname !== '/signup' &&
			pathname !== '/store/login' &&
			pathname !== '/store/signup'
		) {
			navigate('/login');
		}
	}

	function navigateToRoleDefaultPage(pathname: string, role: string, userId: number) {
		if (
			pathname === '/' ||
			pathname === '/login' ||
			pathname === '/signup' ||
			pathname === '/store/login' ||
			pathname === '/store/signup'
		) {
			navigate(role === 'user' ? `/find` : `/store/${userId}/find`);
		} else if (role !== 'user' && !pathname.includes('store')) {
			navigate('/role');
		} else if (role === 'user' && pathname.includes('store')) {
			navigate('/role');
		}
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
