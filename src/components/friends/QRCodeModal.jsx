import React, {useEffect, useRef, useState} from "react";
import {Box, IconButton, Modal, Stack} from "@mui/material";
import {Close} from "@mui/icons-material";
import QrScanner from "qr-scanner";
import LoadedCourses from "../profile/LoadedCourses";

export default function QRCodeModal(
    {
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

    const [friendBlock, setFriendBlock] = useState(null);
    const [qrScanner, setQrScanner] = useState(null);
    const qrVideo = useRef(null);

    const handleScanQRCode = () => {
        if (!qrScanner) {
            console.log("set qr scanner")
            let qrScanner = new QrScanner(
                qrVideo.current,
                result => processQRCode(result, qrScanner),
                {
                    returnDetailedScanResult: true,
                    highlightScanRegion: true
                }
            );
            setQrScanner(qrScanner)
            qrScanner.start();
        } else {
            qrScanner.start();
        }
    }

    const processQRCode = (result, qrScanner) => {
        if (isQRValid(result.data)) {
            setFriendBlock(JSON.parse(result.data));
        } else {
            // TODO: close modal and toast error
            return
        }
        ;
    }

    const isQRValid = (str) => {
        // TODO: u can do better than this
        let data;
        try {
            data = JSON.parse(str);
            return (data.name && data.courses);
        } catch (e) {
            return false;
        }
        return false;
    }

    useEffect(() => {
        console.log("effect used")
        if (open && !friendBlock && qrVideo.current) {
            handleScanQRCode()
        }
    }, [open, friendBlock, qrVideo.current]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack spacing={2}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <h2>Scan QR Code</h2>
                        <IconButton
                            aria-label={'close'}
                            onClick={handleClose}
                        >
                            <Close/>
                        </IconButton>
                    </Stack>
                    {!friendBlock
                        ? <video
                            ref={qrVideo}
                            style={{width: '100%'}}
                            disablePictureInPicture
                            playsInline
                        />
                        : <Stack>
                            <h2>{friendBlock.name}'s courses</h2>
                            <LoadedCourses
                                courses={friendBlock.courses}
                            />
                        </Stack>
                    }
                </Stack>
            </Box>
        </Modal>
    );
}