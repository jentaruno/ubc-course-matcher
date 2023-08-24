import React, {useEffect, useRef, useState} from "react";
import {Box, Button, CircularProgress, IconButton, Modal, Stack} from "@mui/material";
import {Close} from "@mui/icons-material";
import QrScanner from "qr-scanner";
import LoadedCourses from "../reusable/LoadedCourses";
import {isQRValid, qrToUserData} from "../../data/utilsQr";

export default function QRCodeModal(
    {
        open,
        handleAddFriend,
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
    const [isLoading, setScanned] = useState(false);
    const qrVideo = useRef(null);


    const createQrScanner = () => {
        let qrScanner = new QrScanner(
            qrVideo.current,
            result => {
                if (!friendBlock && !isLoading) {
                    processQRCode(result, qrScanner);
                }
            },
            {
                returnDetailedScanResult: true,
                highlightScanRegion: true
            }
        );
        setQrScanner(qrScanner);
    }

    const processQRCode = async (result) => {
        setScanned(true);
        if (isQRValid(result.data)) {
            const userData = await qrToUserData(result.data);
            setFriendBlock(userData);
            if (qrScanner) {
                qrScanner.stop();
                setQrScanner(null);
            }
        } else {
            // TODO: toast error
            handleClose();
        }
    }

    const handleSubmit = () => {
        handleAddFriend(friendBlock);
        onClose();
    }

    const onClose = () => {
        if (qrScanner) {
            qrScanner.stop();
        }
        setFriendBlock(null);
        setQrScanner(null);
        setScanned(false);
        handleClose();
    }

    useEffect(() => {
        const handleQrScanner = async () => {
            await qrVideo.current;
            if (open && !friendBlock && qrVideo.current) {
                if (!qrScanner) {
                    createQrScanner();
                } else {
                    qrScanner.start();
                }
            } else if (qrScanner) {
                qrScanner.stop();
            }
        };

        handleQrScanner()
            .catch(console.error);
    }, [friendBlock, open, qrVideo, qrScanner]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stack spacing={2}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <h2>Scan QR Code</h2>
                        <IconButton
                            aria-label={'close'}
                            onClick={onClose}
                        >
                            <Close/>
                        </IconButton>
                    </Stack>
                    <Box sx={{maxHeight: '80vh'}}>
                        {!friendBlock
                            ? !isLoading
                                ? <video
                                    ref={qrVideo}
                                    style={{width: '100%', height: '100%'}}
                                    disablePictureInPicture
                                    playsInline
                                />
                                : <CircularProgress/>
                            : <Stack spacing={2}>
                                <h2>{friendBlock.name}'s courses</h2>
                                <Box sx={{height: '30vh'}}>
                                    <LoadedCourses
                                        courses={friendBlock.courses}
                                    />
                                </Box>
                                <Button
                                    variant={'contained'}
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </Stack>
                        }
                    </Box>
                </Stack>
            </Box>
        </Modal>
    );
}