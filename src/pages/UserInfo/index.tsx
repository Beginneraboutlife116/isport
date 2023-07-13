import { useState } from 'react';
import styles from './styles.module.scss';
import MyAccount from '../../components/MyAccount';
import MyPlan from '../../components/MyPlan';

export default function UserInfoPage() {
	const [element, setElement] = useState('myAccount');

	return (
		<main className={styles.container}>
			<h1 className='hidden'>我的帳戶資訊</h1>
			<div className={styles.header}>
				<h2
					className={`${styles.header__title} ${
						element === 'myAccount' ? styles.currentElement : ''
					}`.trim()}
				>
					<label htmlFor='myAccount'>我的帳戶</label>
					<input
						className='hidden'
						type='radio'
						id='myAccount'
						name='whichElement'
						value='myAccount'
						onChange={() => setElement('myAccount')}
						checked={element === 'myAccount'}
					/>
				</h2>
				<h2
					className={`${styles.header__title} ${
						element === 'myPlan' ? styles.currentElement : ''
					}`.trim()}
				>
					<label htmlFor='myPlan'>我的方案</label>
					<input
						className='hidden'
						type='radio'
						id='myPlan'
						name='whichElement'
						value='myPlan'
						onChange={() => setElement('myPlan')}
						checked={element === 'myPlan'}
					/>
				</h2>
			</div>
			<div>
				{element === 'myAccount' && <MyAccount />}
				{element === 'myPlan' && <MyPlan />}
			</div>
		</main>
	);
}
