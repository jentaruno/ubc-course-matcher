import {Box, Button, IconButton, Modal, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {UploadCalendar} from "../UploadCalendar";
import LoadedCourses from "../profile/LoadedCourses";
import {Close} from "@mui/icons-material";

export default function CalendarFileModal(
    {
        friends,
        setFriends,
        open,
        handleAddFriend,
        handleClose
    }) {
    // TODO: form validation error handling
    // TODO: disallow duplicate names
    // TODO: disallow naming the friend "user"
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
            <Box sx={style}>
                <Stack spacing={2}>
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <h2>Add Friend's Calendar</h2>
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
                        userName={friendName}
                        courses={friends}
                        handleUpdate={setPreviewCourses}
                    />
                    <h2>Preview</h2>
                    {previewCourses.courseList &&
                        <p>
                            {previewCourses.courseList.length
                                + " "
                                + term
                                + " sections"
                            }
                        </p>
                    }
                    <Box sx={{height: '30vh'}}>
                        <LoadedCourses
                            courses={previewCourses.courseList}
                        />
                    </Box>
                    <Button
                        variant={'contained'}
                        onClick={handleUpdateCourses}
                    >
                        Add Friend
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}