import { ReactNode, forwardRef } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import Button from '../Button';
import styles from './styles.module.scss';

type DialogProps = {
	closeDialog: Function;
	children: ReactNode;
	dialogType?: string;
	className?: string;
};

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
	{ closeDialog, children, dialogType },
	ref,
) {
	return (
		<dialog ref={ref} className={styles[dialogType || 'dialog']}>
			<Button type='button' onClick={() => closeDialog()} className={styles.close}>
				<IoMdCloseCircle />
			</Button>
			{children}
		</dialog>
	);
});

export default Dialog;
