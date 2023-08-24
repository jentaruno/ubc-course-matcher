import {Button} from "@mui/material";
import React from "react";
import useSectionInfo from "../../data/useSectionInfo";

export default function AddSectionButton(
    {
        formData,
        handleAddCourse
    }) {

    const sectionInfo = useSectionInfo(formData.subject + "-" + formData.course + "-" + formData.section);

    return (
        <Button
            disabled={!sectionInfo || !sectionInfo.classTimes || sectionInfo.classTimes.length === 0}
            variant={'contained'}
            onClick={() => handleAddCourse(sectionInfo)}
        >
            {formData.subject && formData.course && formData.section && !sectionInfo
                ? "Loading..."
                : "Add Section"}
        </Button>
    )
}