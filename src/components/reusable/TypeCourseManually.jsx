import {Autocomplete, Grid, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import DropdownCourseNumbers from "../friends/DropdownCourseNumbers";
import DropdownSectionNumbers from "../friends/DropdownSectionNumbers";
import AddSectionButton from "../friends/AddSectionButton";
import useSubjects from "../../data/useSubjects";

export default function TypeCourseManually({courses, handleUpdate}) {
    const subjects = useSubjects();
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
                formData={formData}
                handleAddCourse={handleAddCourse}
            />
        </Stack>
    );
}