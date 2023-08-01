import { ReactNode, forwardRef } from 'react';
import { IoMdCloseCircle } from 'react-icons/io';
import Button from '../Button';
import styles from './styles.module.scss';
import DeleteModal from './DeleteModal';
import MapModal from './MapModal';
import FormDialogForClass from './FormDialogForClass';
import FormDialogForPlan from './FormDialogForPlan';
import FormDialogWithImage from './FormDialogWithImage';

type DialogProps = {
	closeDialog: Function;
	children: ReactNode;
	dialogType?: 'dialog' | 'modal';
	className?: string;
};

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog(
	{ closeDialog, children, dialogType = 'dialog', ...props },
	ref,
) {
	return (
		<dialog ref={ref} className={`${styles[dialogType]} ${props.className ?? ''}`.trim()}>
			<Button type='button' onClick={() => closeDialog()} className={styles.close}>
				<IoMdCloseCircle />
			</Button>
			{children}
		</dialog>
	);
});

export default Dialog;
export { MapModal, DeleteModal, FormDialogForClass, FormDialogWithImage, FormDialogForPlan };
