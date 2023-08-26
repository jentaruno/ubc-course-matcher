import {Button} from "@mui/material";
import React from "react";
import useSectionInfo from "../../data/useSectionInfo";

export default function AddSectionButton(
    {
        formData,
        handleAddCourse
    }) {

    const sectionInfo = useSectionInfo(formData);

    const isLoading = () => {
        return formData.subject && formData.course && formData.section &&
            (sectionInfo.name !== [formData.subject, formData.course, formData.section].join(" ") ||
                !sectionInfo.classTimes)
    }

    return (
        <Button
            disabled={isLoading() ||
                [formData.subject, formData.course, formData.section].some(e => (e === "Loading..." || e === ""))}
            variant={'contained'}
            onClick={() => handleAddCourse(sectionInfo)}
        >
            {isLoading()
                ? "Loading..."
                : "Add Section"}
        </Button>
    )
}