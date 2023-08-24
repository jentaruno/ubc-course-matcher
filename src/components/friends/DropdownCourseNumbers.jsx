import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import useCourses from "../../data/useCourses";

export default function DropdownCourseNumbers(
    {
        subject,
        value,
        handleChange
    }) {

    const courseNumbers = useCourses(subject);

    return (
        <Autocomplete
            disablePortal
            autoHighlight={true}
            autoSelect={true}
            id="course"
            options={courseNumbers ?? []}
            value={value}
            renderInput={(params) =>
                <TextField {...params} label="Course"/>
            }
            onChange={(e, value) => handleChange(e, value)}
        />
    )
}