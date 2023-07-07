import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './sass/index.scss';
import Find from './pages/Find/index.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [{ path: 'find', element: <Find /> }],
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
