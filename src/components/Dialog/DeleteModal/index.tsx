import { useEffect, useRef } from 'react';
import Button from '../../Button';
import Dialog from '..';
import styles from './styles.module.scss';

type DeleteModalProps = {
	isOpen: boolean;
	closeDialog: Function;
	handleDelete: Function;
};

export default function DeleteModal({ isOpen, closeDialog, handleDelete }: DeleteModalProps) {
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
		<Dialog ref={dialogRef} closeDialog={closeDialog} dialogType='modal'>
			<div className={styles.container}>
				<p>確定要刪除該課程嗎？</p>
				<div className={styles.btn__wrapper}>
					<Button
						type='button'
						className={`${styles.btn} ${styles.btn__cancel}`}
						onClick={() => closeDialog()}
					>
						取消
					</Button>
					<Button
						type='button'
						className={`${styles.btn} ${styles.btn__confirm}`}
						onClick={() => handleDelete()}
					>
						確定
					</Button>
				</div>
			</div>
		</Dialog>
	);
}
