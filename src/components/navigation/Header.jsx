import React from 'react';
import {Box, Typography} from "@mui/material";

export default function Header() {
    return (
        <Box
            sx={{
                zIndex: 50,
                background: 'white',
                py: '0.5rem',
                position: 'sticky',
                top: 0,
                textAlign: 'center',
                borderBottom: '1px solid #e0e0e0',
            }}
        >
            <Typography variant={'h5'}>
                🙌 UBC Course Matcher
            </Typography>
        </Box>
    );
}
