import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Header from './components/Header';
import './sass/index.scss';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{ path: 'header', element: <Header /> },
			{ path: '1', element: <div>This is 1.</div> },
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
