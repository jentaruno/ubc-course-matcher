import {Autocomplete, TextField} from "@mui/material";
import React from "react";
import useSections from "../../data/useSections";

export default function DropdownSectionNumbers(
    {
        course,
        value,
        handleChange
    }) {

    const sectionNumbers = useSections(course);

    return (
        <Autocomplete
            disablePortal
            autoHighlight={true}
            autoSelect={true}
            id="course"
            options={sectionNumbers ?? []}
            value={value}
            defaultValue=""
            isOptionEqualToValue={(option, value) => option === value || value === ''}
            renderInput={(params) =>
                <TextField {...params} label="Section"/>
            }
            onChange={(e, value) => handleChange(e, value)}
        />
    )
}