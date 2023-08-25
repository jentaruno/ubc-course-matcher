import {Box, Button, IconButton, Modal, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {Close} from "@mui/icons-material";
import TypeCourseManually from "../reusable/TypeCourseManually";
import LoadedCourses from "../reusable/LoadedCourses";
import {ModalBox} from "../reusable/ModalBox";

export default function TypeManuallyModal(
    {
        open,
        handleAddFriend,
        handleClose
    }) {
    // TODO: form validation error handling
    // TODO: make lazy
    // TODO: set term

    const [friendName, setFriendName] = useState("");
    const [previewCourses, setPreviewCourses] = useState([]);
    // const [term, setTerm] = useState("Winter");

    const handleSubmit = () => {
        if (friendName.trim() !== "" && previewCourses.length > 0) {
            const newFriend = {courses: previewCourses};
            newFriend.name = friendName;
            handleAddFriend(newFriend);

            setFriendName("");
            setPreviewCourses([]);
            handleClose();
        }
    }

    const handleDeleteCourse = (i) => {
        const newCourses = [...previewCourses];
        newCourses.splice(i, 1);
        setPreviewCourses(newCourses);
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <ModalBox>
                <Stack spacing={2}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <Typography variant={'h5'}>Add Friend's Sections</Typography>
                        <IconButton
                            aria-label={'close'}
                            onClick={handleClose}
                        >
                            <Close/>
                        </IconButton>
                    </Stack>
                    <TextField
                        required
                        id="outlined-required"
                        label="Name"
                        onChange={(e) => setFriendName(e.target.value)}
                    />
                    <TypeCourseManually
                        courses={previewCourses}
                        handleUpdate={setPreviewCourses}
                    />
                    <Typography variant={'h5'}>Preview</Typography>
                    <Box sx={{height: '30vh'}}>
                        <LoadedCourses
                            courses={previewCourses}
                            handleDelete={handleDeleteCourse}
                        />
                    </Box>
                    <Button
                        variant={'contained'}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Stack>
            </ModalBox>
        </Modal>
    );
}