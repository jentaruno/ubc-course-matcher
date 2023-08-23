import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import useSections from "../../data/useSections";

export default function DropdownSectionNumbers(
    {
        course,
        handleChange
    }) {

    const sectionNumbers = useSections(course);

    return (
        <Autocomplete
            disablePortal
            id="course"
            options={sectionNumbers ?? []}
            renderInput={(params) =>
                <TextField {...params} label="Section"/>
            }
            onInputChange={(e, value) => handleChange(e, value)}
        />
    )
}