import { useRef, useEffect } from 'react';
import Dialog from '..';
import styles from '../styles.module.scss';

const apiKey = import.meta.env.VITE_GOOGLE_EMBED_API;

type MapModal = {
	closeDialog: Function;
	isOpen: boolean;
	storeMap: { address: string; storeName: string };
};

export default function MapModal({
	closeDialog,
	isOpen,
	storeMap: { address, storeName },
}: MapModal) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (dialog) {
			if (isOpen && !dialog.open) {
				dialog.showModal();
			}
			if (!isOpen && dialog.open) {
				dialog.close();
			}
		}
		return () => {
			if (dialog && dialog.open) {
				dialog.close();
			}
		};
	}, [isOpen]);

	return (
		<Dialog
			closeDialog={closeDialog}
			dialogType='modal'
			ref={dialogRef}
			key={storeName}
			className={styles['modal--map']}
		>
			<h2>{storeName}</h2>
			<iframe
				title='map'
				loading='lazy'
				src={`https://www.google.com/maps/embed/v1/place?q=${address}&key=${apiKey}`}
			></iframe>
		</Dialog>
	);
}
