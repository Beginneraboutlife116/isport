import { useState } from 'react';
import { BsPlusCircleFill } from 'react-icons/bs';
import CardList from '../../components/CardList';
import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import styled from './styles.module.scss';
import FormDialogWithImage from '../../components/Dialog/FormDialogWithImage';

const data = [
	{
		id: 1,
		storeName: 'xx運動館',
		photo: '0',
		address: '住址',
		rating: 9.8,
		reviewCounts: '1,000',
		introduction:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	},
	{
		id: 2,
		storeName: 'xx運動館',
		photo: '0',
		address: '住址',
		rating: 9.8,
		reviewCounts: '1,000',
		introduction:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	},
	{
		id: 3,
		storeName: 'xx運動館',
		photo: '0',
		address: '住址',
		rating: 9.8,
		reviewCounts: '1,000',
		introduction:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	},
	{
		id: 4,
		storeName: 'xx運動館',
		photo: '0',
		address: '住址',
		rating: 9.8,
		reviewCounts: '1,000',
		introduction:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	},
	{
		id: 5,
		storeName: 'xx運動館',
		photo: '0',
		address: '住址',
		rating: 9.8,
		reviewCounts: '1,000',
		introduction:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	},
	{
		id: 6,
		storeName: 'xx運動館',
		photo: '0',
		address: '住址',
		rating: 9.8,
		reviewCounts: '1,000',
		introduction:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	},
	{
		id: 7,
		storeName: 'xx運動館',
		photo: '0',
		address: '住址',
		rating: 9.8,
		reviewCounts: '1,000',
		introduction:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	},
	{
		id: 8,
		storeName: 'xx運動館',
		photo: '0',
		address: '住址',
		rating: 9.8,
		reviewCounts: '1,000',
		introduction:
			'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel unde quidem mollitia! Quidem totam esse alias? Non officiis sit asperiores distinctio eaque veritatis doloribus consectetur. Voluptates ex modi architecto mollitia!',
	},
];

export default function StoreFindPage() {
	const [toggleDialog, setToggleDialog] = useState(false);

	return (
		<div className={styled.container}>
			<div className={styled.container__wrap}>
				<div className={styled.container__dialog}>
					<SearchBar />
					<Button
						onClick={() => setToggleDialog(!toggleDialog)}
						className={styled['btn--openDialog']}
					>
						<BsPlusCircleFill />
					</Button>
					<FormDialogWithImage
						status={toggleDialog}
						handleDialogToggle={setToggleDialog}
						buttonDescription='送出'
					/>
				</div>
				<CardList data={data} />
			</div>
		</div>
	);
}
