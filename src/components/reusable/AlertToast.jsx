import {Alert, Snackbar} from "@mui/material";
import React from "react";

export default function AlertToast({open, setOpen, message, variant}) {
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={2000} onClose={handleCloseToast}>
            <Alert onClose={handleCloseToast} severity={variant} sx={{width: '100%'}}>
                {message}
            </Alert>
        </Snackbar>
    )
}