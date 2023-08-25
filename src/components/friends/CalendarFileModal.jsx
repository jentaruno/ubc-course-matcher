import {Box, Button, IconButton, Modal, Stack, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import {UploadCalendar} from "../reusable/UploadCalendar";
import LoadedCourses from "../reusable/LoadedCourses";
import {Close} from "@mui/icons-material";
import {ModalBox} from "../reusable/ModalBox";

export default function CalendarFileModal(
    {
        open,
        handleAddFriend,
        handleClose
    }) {
    // TODO: form validation error handling
    // TODO: disallow duplicate names
    // TODO: disallow naming the friend "user"

    const [friendName, setFriendName] = useState("");
    const [term, setTerm] = useState("Winter");
    const [previewCourses, setPreviewCourses] = useState({});

    function handleUpdateCourses() {
        if (friendName.trim() !== "" && Object.keys(previewCourses).length > 0) {
            const newCourse = previewCourses;
            newCourse.name = friendName;
            setFriendName("");
            setPreviewCourses({});
            handleClose();
            handleAddFriend(newCourse);
        }
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
                        <Typography variant={'h5'}>Add Friend's Calendar</Typography>
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
                    <UploadCalendar
                        setTerm={setTerm}
                        handleUpdate={setPreviewCourses}
                    />
                    <Typography variant={'h5'}>Preview</Typography>
                    {previewCourses.courses &&
                        <Typography>
                            {previewCourses.courses.length
                                + " "
                                + term
                                + " sections"
                            }
                        </Typography>
                    }
                    <Box sx={{height: '30vh'}}>
                        <LoadedCourses
                            courses={previewCourses.courses}
                        />
                    </Box>
                    <Button
                        variant={'contained'}
                        onClick={handleUpdateCourses}
                    >
                        Add Friend
                    </Button>
                </Stack>
            </ModalBox>
        </Modal>
    );
}