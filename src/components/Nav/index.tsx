import { Link, Outlet } from 'react-router-dom';

export default function Nav() {
	return (
		<>
			<nav className='wrap'>
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex laborum alias labore sunt
					omnis? Excepturi necessitatibus vel, voluptatem ea odit ducimus earum debitis mollitia
					aspernatur est labore soluta cupiditate et!
				</p>
				<Link to='1'>1</Link>
			</nav>
		</>
	);
}
