import {Box, Card, CardContent, Grid, IconButton, Link, Modal, Stack} from "@mui/material";
import {Close, Delete} from "@mui/icons-material";
import React, {useState} from "react";
import LoadedCourses from "../profile/LoadedCourses";

export default function FriendBlock(
    {
        key,
        name,
        courses,
        handleDelete
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

    // TODO: whole card tappable
    
    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    return (
        <Box key={key}>
            <Card>
                <CardContent>
                    <Grid
                        container
                        spacing={0}
                        alignItems={'center'}
                    >
                        <Grid item xs={11}>
                            <Link onClick={handleOpenModal} underline={'none'}>
                                <h2>{name}</h2>
                                <span>
                                    {courses.slice(0, 2).join(", ") + ',...'}
                                </span>
                            </Link>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={handleDelete}>
                                <Delete/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Stack
                        direction={'column'}
                        spacing={1}
                    >
                        <Stack direction={'row'} justifyContent={'space-between'}>
                            <h2>{name}'s sections</h2>
                            <IconButton
                                aria-label={'close'}
                                onClick={handleCloseModal}
                            >
                                <Close/>
                            </IconButton>
                        </Stack>
                        <Box height={'50vh'}>
                            <LoadedCourses courses={courses}/>
                        </Box>
                    </Stack>
                </Box>
            </Modal>
        </Box>
    )
}