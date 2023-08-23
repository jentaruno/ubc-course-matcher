import {Autocomplete, Box, Button, Grid, IconButton, Modal, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import LoadedCourses from "../reusable/LoadedCourses";
import {Close} from "@mui/icons-material";
import useSubjects from "../../data/useSubjects";
import DropdownCourseNumbers from "./DropdownCourseNumbers";
import DropdownSectionNumbers from "./DropdownSectionNumbers";
import AddSectionButton from "./AddSectionButton";

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
    const subjects = useSubjects();

    const [friendName, setFriendName] = useState("");
    // const [term, setTerm] = useState("Winter");
    const [previewCourses, setPreviewCourses] = useState([]);
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

    const handleAddCourse = (course) => {
        const newCourses = [...previewCourses];
        newCourses.push(course);
        setPreviewCourses(newCourses);
        setFormData({
            subject: '',
            course: '',
            section: '',
        });
    }

    const handleDeleteCourse = (i) => {
        const newCourses = [...previewCourses];
        newCourses.splice(i, 1);
        setPreviewCourses(newCourses);
    }

    function handleUpdateCourses() {
        if (friendName.trim() !== "" && previewCourses.length > 0) {
            const newCourse = {courses: previewCourses};
            newCourse.name = friendName;
            setFriendName("");
            setFormData({
                subject: '',
                course: '',
                section: '',
            });
            setPreviewCourses([]);
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
                    <b>Search for sections</b>
                    <Grid container>
                        <Grid item xs={4} pr={1}>
                            <Autocomplete
                                // TODO: move on to next autocomplete after pick
                                disablePortal
                                id="subject"
                                options={subjects ?? []}
                                value={formData.subject}
                                renderInput={(params) =>
                                    <TextField {...params} label="Subject"/>
                                }
                                onChange={(e, value) => handleChange("subject", value)}
                            />
                        </Grid>
                        <Grid item xs={4} pr={1}>
                            <DropdownCourseNumbers
                                subject={formData.subject}
                                value={formData.course}
                                handleChange={(e, value) => handleChange("course", value)}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <DropdownSectionNumbers
                                course={formData.subject + "-" + formData.course}
                                value={formData.section}
                                handleChange={(e, value) => handleChange("section", value)}
                            />
                        </Grid>
                    </Grid>
                    <AddSectionButton
                        disabled={!formData.subject ||
                            !formData.course ||
                            !formData.section ||
                            formData.subject.trim() === "" ||
                            formData.course.trim() === "" ||
                            formData.section.trim() === ""}
                        formData={formData}
                        handleAddCourse={handleAddCourse}
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
                        onClick={handleUpdateCourses}
                    >
                        Add Friend
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}