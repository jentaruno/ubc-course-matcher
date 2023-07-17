import {Box, Modal, Stack, TextField} from "@mui/material";
import {useState} from "react";
import {UploadCalendar} from "../UploadCalendar";

export default function CalendarFileModal(
    {
        friends,
        setFriends,
        open,
        handleClose
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
        p: 4,
    };

    const [friendName, setFriendName] = useState("Friend");
    const [term, setTerm] = useState("Winter");

    function handleUpdateCourses(courses) {
        let newCourses = friends;
        newCourses.push(courses);
        setFriends(newCourses);
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
                    <h2>Add Friend's Calendar</h2>
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
                        handleUpdate={handleUpdateCourses}
                    />
                </Stack>
            </Box>
        </Modal>
    );
}