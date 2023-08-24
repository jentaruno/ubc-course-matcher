import {Autocomplete, Grid, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import DropdownCourseNumbers from "../friends/DropdownCourseNumbers";
import DropdownSectionNumbers from "../friends/DropdownSectionNumbers";
import AddSectionButton from "../friends/AddSectionButton";
import useSubjects from "../../data/useSubjects";
import AlertToast from "./AlertToast";

export default function TypeCourseManually({courses, handleUpdate}) {
    const subjects = useSubjects();
    const [formData, setFormData] = useState({
        subject: '',
        course: '',
        section: '',
    });
    const [openToast, setOpenToast] = useState(false);

    const handleChange = (key, value) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [key]: value,
        }));
    }

    const handleAddCourse = (course) => {
        if (courses.map(course => course.name).includes(course.name)) {
            setOpenToast(true);
            return;
        }
        const newCourses = [...courses];
        newCourses.push(course);
        handleUpdate(newCourses);
        setFormData({
            subject: '',
            course: '',
            section: '',
        });
    }


    return (
        <Stack spacing={2}>
            <b>Search for sections</b>
            <Grid container>
                <Grid item xs={4} pr={1}>
                    <Autocomplete
                        // TODO: move on to next autocomplete after pick
                        disablePortal
                        autoHighlight={true}
                        autoSelect={true}
                        id="subject"
                        options={subjects ?? []}
                        value={formData.subject}
                        defaultValue=""
                        isOptionEqualToValue={(option, value) => option === value || value === ''}
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
                formData={formData}
                handleAddCourse={handleAddCourse}
            />
            <AlertToast
                open={openToast}
                setOpen={setOpenToast}
                variant={"error"}
                message={"You've already added this section."}
            />
        </Stack>
    );
}