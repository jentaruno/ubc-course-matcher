import {Autocomplete, Box, Button, Grid, IconButton, Modal, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import LoadedCourses from "../profile/LoadedCourses";
import {Close} from "@mui/icons-material";
import useSubjects from "../../data/useSubjects";
import DropdownCourseNumbers from "./DropdownCourseNumbers";
import DropdownSectionNumbers from "./DropdownSectionNumbers";

export default function TypeManuallyModal(
    {
        friends,
        setFriends,
        open,
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
    const subjects = useSubjects();
    const [courses, setCourses] = useState();
    const [section, setSections] = useState();

    const [friendName, setFriendName] = useState("");
    const [term, setTerm] = useState("Winter");
    const [previewCourses, setPreviewCourses] = useState({});
    const [formData, setFormData] = useState({
        subject: '',
        course: '',
        section: '',
    });

    const handleChange = (key, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [key]: value,
        }));
    }
    const handleAddCourse = () => {
        // TODO: add to courses state
    }
    const handleUpdateCourses = () => {
        if (friendName.trim() !== "" && Object.keys(previewCourses).length > 0) {
            const newCourses = [...friends];
            const newCourse = previewCourses;
            newCourse.name = friendName;
            newCourses.push(newCourse);
            setFriends(newCourses);
            setFriendName("");
            setPreviewCourses({});
            handleClose();
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
                    <p>Search for sections</p>
                    <Grid container>
                        <Grid item xs={4} pr={1}>
                            <Autocomplete
                                // TODO: move on to next autocomplete after pick
                                disablePortal
                                id="subject"
                                options={subjects ?? []}
                                renderInput={(params) =>
                                    <TextField {...params} label="Subject"/>
                                }
                                onInputChange={(e, value) => handleChange("subject", value)}
                            />
                        </Grid>
                        <Grid item xs={4} pr={1}>
                            <DropdownCourseNumbers
                                subject={formData.subject}
                                handleChange={(e, value) => handleChange("course", value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <DropdownSectionNumbers
                                course={formData.subject + "-" + formData.course}
                                handleChange={(e, value) => handleChange("section", value)}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant={'outlined'}
                        onClick={handleAddCourse}
                    >
                        Add
                    </Button>
                    <h2>Preview</h2>
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
            </Box>
        </Modal>
    );
}