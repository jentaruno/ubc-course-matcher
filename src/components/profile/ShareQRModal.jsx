import React from "react";
import {Box, IconButton, Modal, Stack} from "@mui/material";
import {Close} from "@mui/icons-material";
import QRCode from "react-qr-code";

export default function ShareQRModal(
    {
        qrData,
        open,
        handleClose,
    }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90vw',
        bgcolor: 'background.paper',
        borderRadius: '1rem',
        boxShadow: 12,
        p: 2,
    };

    const qrString = JSON.stringify(qrData);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack spacing={2} alignItems={'center'}>
                    <Stack width={'100%'} direction={'row'} justifyContent={'space-between'}>
                        <h2>{qrData.name + "'s Timetable"}</h2>
                        <IconButton
                            aria-label={'close'}
                            onClick={handleClose}
                        >
                            <Close/>
                        </IconButton>
                    </Stack>
                    <QRCode
                        size={4000}
                        style={{height: "auto", maxWidth: "60vh", width: "100%"}}
                        value={qrString}
                        viewBox={`0 0 256 256`}
                    />
                </Stack>
            </Box>
        </Modal>
    );
}