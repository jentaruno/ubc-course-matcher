import {Box, Divider, Fab, Link, Popover, Stack} from "@mui/material";
import {Add, CalendarMonth, QrCode, Title} from "@mui/icons-material";
import React, {useState} from "react";
import CalendarFileModal from "./CalendarFileModal";

export function AddFriendButton({friends, setFriends}) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [openCalendarFile, setOpenCalendarFile] = useState(false);
    const handleOpenCalendarFile = () => setOpenCalendarFile(true);
    const handleCloseCalendarFile = () => setOpenCalendarFile(false);


    return (
        <Box>
            <Fab sx={{position: "fixed", right: "1rem", bottom: "5rem"}}
                 onClick={handleClick}
                 size="large"
                 color="secondary"
                 aria-label="qr-code">
                <Add/>
            </Fab>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
            >
                <Stack
                    sx={{padding: '1rem'}}
                    spacing={1}
                    divider={<Divider orientation={'horizontal'} flexItem/>}
                >
                    <Link underline={'none'}>
                        <QrCode/> QR code
                    </Link>
                    <Link onClick={handleOpenCalendarFile} underline={'none'}>
                        <CalendarMonth/> Calendar file
                    </Link>
                    <Link underline={'none'}>
                        <Title/> Type manually
                    </Link>
                </Stack>
            </Popover>

            <CalendarFileModal
                friends={friends}
                setFriends={setFriends}
                open={openCalendarFile}
                handleClose={handleCloseCalendarFile}
            />
        </Box>
    );
}