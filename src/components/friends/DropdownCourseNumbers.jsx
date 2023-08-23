import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import useCourses from "../../data/useCourses";

export default function DropdownCourseNumbers(
    {
        subject,
        handleChange
    }) {

    const courseNumbers = useCourses(subject);

    return (
        <Autocomplete
            disablePortal
            id="course"
            options={courseNumbers ?? []}
            renderInput={(params) =>
                <TextField {...params} label="Course"/>
            }
            onInputChange={(e, value) => handleChange(e, value)}
        />
    )
}