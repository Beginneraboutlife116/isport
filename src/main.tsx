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
import ErrorPage from './pages/Error/index.tsx';
import OwnerStore from './pages/OwnerStore/index.tsx';

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
						path: 'signup/next',
						element: <SignupStepTwoPage />,
					},
					{ path: 'store/login', element: <StoreLoginPage /> },
					{ path: 'store/signup', element: <StoreSignupPage /> },
				],
			},
			{ path: 'find', element: <Find /> },
			{ path: 'find/:id', element: <Store /> },
			{ path: 'collection', element: <Collection /> },
			{ path: 'reservation', element: <Reservation /> },
			{
				path: 'user',
				element: <UserInfoPage />,
				children: [
					{ path: 'account', element: <MyAccountPage /> },
					{ path: 'plan', element: <MyPlanPage /> },
				],
			},
			{
				path: 'store',
				children: [
					{ path: 'account', element: <StoreAccount /> },
					{ path: 'find', element: <StoreFindPage /> },
					{ path: 'find/:storeId', element: <OwnerStore /> },
				],
			},
			{ path: 'role', element: <ErrorPage /> },
		],
	},
	{
		path: '*',
		element: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</React.StrictMode>,
);
