import {Box, Button, IconButton, Modal, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {Close} from "@mui/icons-material";
import TypeCourseManually from "../reusable/TypeCourseManually";
import LoadedCourses from "../reusable/LoadedCourses";

export default function TypeManuallyModal(
    {
        open,
        handleAddFriend,
        handleClose
    }) {
    // TODO: form validation error handling
    // TODO: empty form when close
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
            <Box sx={style}>
                <Stack spacing={2}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <h2>Add Friend's Sections</h2>
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
                    <h2>Preview</h2>
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
            </Box>
        </Modal>
    );
}