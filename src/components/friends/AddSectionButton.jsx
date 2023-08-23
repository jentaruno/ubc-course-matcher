import {Button} from "@mui/material";
import React from "react";
import useSectionInfo from "../../data/useSectionInfo";

export default function AddSectionButton(
    {
        disabled,
        formData,
        handleAddCourse
    }) {

    const sectionInfo = useSectionInfo(formData.subject + "-" + formData.course + "-" + formData.section);

    const handleClick = () => {
        if (sectionInfo) {
            handleAddCourse(sectionInfo);
        }
    }

    return (
        <Button
            disabled={disabled}
            variant={'contained'}
            onClick={handleClick}
        >
            Add Section
        </Button>
    )
}