import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './sass/index.scss';
import App from './App.tsx';
import LoginPage from './pages/login/index.tsx';
import Find from './pages/Find/index.tsx';
import Collection from './pages/Collection/index.tsx';
import Reservation from './pages/Reservation/index.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: 'login', element: <LoginPage /> },
			{ path: 'find', element: <Find /> },
			{ path: 'collection', element: <Collection /> },
			{ path: 'reservation', element: <Reservation /> },
		],
	},
	{
		path: '*',
		element: <div>404</div>,
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
