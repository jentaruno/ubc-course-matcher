import {Box} from "@mui/material";
import React from 'react';

export const ModalBox = ({children}) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        maxWidth: '640px',
        bgcolor: 'background.paper',
        borderRadius: '1rem',
        boxShadow: 12,
        p: 2,
    };

    return (
        <Box sx={style}>
            {children}
        </Box>
    )
};
