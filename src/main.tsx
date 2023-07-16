import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './sass/index.scss';
import App from './App.tsx';
import Find from './pages/Find/index.tsx';
import Collection from './pages/Collection/index.tsx';
import Reservation from './pages/Reservation/index.tsx';
import {
	UserAuthPage,
	LoginPage,
	SignupStepOnePage,
	SignupStepTwoPage,
	StoreLoginPage,
	StoreSignupPage,
} from './pages/Auth/index.tsx';
import Store from './pages/Store/index.tsx';
import { UserInfoPage, MyAccountPage, MyPlanPage } from './pages/UserInfo/index.tsx';
import StoreAccount from './pages/StoreAccount/index.tsx';
import StoreFindPage from './pages/StoreFind/index.tsx';
import { AuthProvider } from './contexts/authContext.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '',
				element: <UserAuthPage />,
				children: [
					{ path: 'login', element: <LoginPage /> },
					{ path: 'signup', element: <SignupStepOnePage /> },
					{
						path: 'signup/:id',
						element: <SignupStepTwoPage />,
					},
					{ path: 'store/login', element: <StoreLoginPage /> },
					{ path: 'store/signup', element: <StoreSignupPage /> },
				],
			},
			{ path: 'find', element: <Find />, children: [{ path: ':storeId', element: <Store /> }] },
			{ path: 'collection', element: <Collection /> },
			{ path: 'reservation', element: <Reservation /> },
			{
				path: 'user/:id',
				element: <UserInfoPage />,
				children: [
					{ path: '', element: <MyAccountPage /> },
					{ path: 'plan', element: <MyPlanPage /> },
				],
			},
			{
				path: 'store/:ownerId',
				children: [
					{ path: '', element: <StoreAccount /> },
					{ path: 'find', element: <StoreFindPage /> },
				],
			},
		],
	},
	{
		path: '*',
		element: <div>404</div>,
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>,
);
