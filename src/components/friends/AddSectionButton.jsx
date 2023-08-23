import {Button} from "@mui/material";
import React from "react";
import useSectionInfo from "../../data/useSectionInfo";

export default function AddSectionButton(
    {
        section,
        handleAddCourse
    }) {

    const sectionInfo = useSectionInfo(section);

    return (
        <Button
            variant={'contained'}
            onClick={() => handleAddCourse(sectionInfo)}
        >
            Add Section
        </Button>
    )
}