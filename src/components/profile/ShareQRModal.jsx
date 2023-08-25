import React from "react";
import {IconButton, Modal, Stack, Typography} from "@mui/material";
import {Close} from "@mui/icons-material";
import QRCode from "react-qr-code";
import {userDataToQr} from "../../data/utilsQr";
import {ModalBox} from "../reusable/ModalBox";

export default function ShareQRModal(
    {
        qrData,
        open,
        handleClose,
    }) {

    const qrString = JSON.stringify(userDataToQr(qrData));

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ModalBox>
                <Stack spacing={2} alignItems={'center'}>
                    <Stack width={'100%'} direction={'row'} justifyContent={'space-between'}>
                        <Typography variant={'h5'}>{qrData.name}'s Timetable</Typography>
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
            </ModalBox>
        </Modal>
    );
}