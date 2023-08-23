import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface DeleteConfirmationDialogProps {
    isOpen: boolean,
    title: string,
    description: string,
    agreeBtnTitle: string,
    disagreeBtnTitle: string,
    handleAgree: () => void,
    handleDisagree: () => void,
    handleClose: () => void,
}

const DeleteConfirmationDialog = ({
    isOpen,
    title,
    description,
    agreeBtnTitle,
    disagreeBtnTitle,
    handleAgree,
    handleDisagree,
    handleClose,
}: DeleteConfirmationDialogProps) => {
    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle
                id="alert-dialog-title"
                className="dark:text-white dark:bg-gray-700"
            >
                {title}
            </DialogTitle>
            <DialogContent
                className=" dark:bg-gray-700"
            >
                <DialogContentText
                    id="alert-dialog-description"
                    className="dark:text-white "
                >
                    {description}
                </DialogContentText>
            </DialogContent>
            <DialogActions className="dark:bg-gray-700">
                <button
                    onClick={handleDisagree}
                    className="dark:text-blue-200 py-2 px-1 mx-1"
                >
                    {disagreeBtnTitle}
                </button>
                <button
                    onClick={handleAgree}
                    autoFocus
                    className="text-white dark:bg-red-800 bg-red-600 py-1 px-2 mx-1 rounded-md font-semibold"
                >
                    {agreeBtnTitle}
                </button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteConfirmationDialog