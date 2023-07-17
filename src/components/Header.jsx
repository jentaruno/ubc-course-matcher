import React, {Component} from 'react';
import {Box} from "@mui/material";

class Header extends Component {
    state = {}

    render() {
        return (
            <Box
                sx={{
                    zIndex: 50,
                    background: 'white',
                    px: '1rem',
                    py: '0.5rem',
                    position: 'sticky',
                    top: 0,
                    borderBottom: '1px solid #f5f5f5'
                }}
            >
                <h3 className='mb-0'>
                    🙌 UBC Course Matcher
                </h3>
            </Box>
        );
    }
}

export default Header;
