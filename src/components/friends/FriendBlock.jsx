import {Box, Card, CardContent, Grid, IconButton, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import React, {useState} from "react";
import {FriendModal} from "./FriendModal";

export default function FriendBlock(
    {
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

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    return (
        <Box>
            <Card onClick={handleOpenModal} sx={{cursor: 'pointer'}}>
                <CardContent>
                    <Grid
                        container
                        spacing={0}
                        alignItems={'center'}
                    >
                        <Grid item xs={11}>
                            <Typography variant={'h5'}>{name}</Typography>
                            <Typography>
                                {courses.map(e => e.name).slice(0, 2).join(", ") + ',...'}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <IconButton onClick={handleDelete}>
                                <Delete/>
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <FriendModal open={openModal} onClose={handleCloseModal} sx={style} name={name} courses={courses}/>
        </Box>
    )
}