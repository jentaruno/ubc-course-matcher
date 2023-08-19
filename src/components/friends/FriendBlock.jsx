import {Box, Card, CardContent, Grid, IconButton, Link} from "@mui/material";
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
                                    {courses.map(e => e.name).slice(0, 2).join(", ") + ',...'}
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
            <FriendModal open={openModal} onClose={handleCloseModal} sx={style} name={name} courses={courses}/>
        </Box>
    )
}