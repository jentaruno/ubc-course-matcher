import {Button} from "@mui/material";
import React from "react";
import useSectionInfo from "../../data/useSectionInfo";

export default function AddSectionButton(
    {
        formData,
        handleAddCourse
    }) {

    const sectionInfo = useSectionInfo(formData);

    return (
        <Button
            disabled={!sectionInfo || !sectionInfo.classTimes ||
                [formData.subject, formData.course, formData.section].some(e => (e === "Loading..." || e === ""))}
            variant={'contained'}
            onClick={() => handleAddCourse(sectionInfo)}
        >
            {formData.subject && formData.course && formData.section && !sectionInfo.classTimes
                ? "Loading..."
                : "Add Section"}
        </Button>
    )
}