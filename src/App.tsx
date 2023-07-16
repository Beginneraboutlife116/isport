import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { FindProvider } from './contexts/findContext';
import { useAuth } from './contexts/authContext';
import { getUserData } from './api/user';

function App() {
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
								navigateToRoleDefaultPage(pathname, 'user', response.data.id);
							} else {
								setAuth({
									...auth,
									avatar: '',
									userId: response.data.id,
									role: 'owner',
									isAuthenticated: true,
								});
								navigateToRoleDefaultPage(pathname, 'owner', response.data.id);
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
			navigate(role === 'user' ? `/find` : `/store/${userId}`);
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
