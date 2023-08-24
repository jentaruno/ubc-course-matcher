import {Button} from "@mui/material";
import React from "react";
import useSectionInfo from "../../data/useSectionInfo";

export default function AddSectionButton(
    {
        formData,
        handleAddCourse
    }) {

    const sectionInfo = useSectionInfo(formData.subject + "-" + formData.course + "-" + formData.section);

    const handleClick = () => {
        if (formData.subject && formData.course && formData.section && sectionInfo) {
            handleAddCourse(sectionInfo);
        }
    }

    return (
        <Button
            disabled={!formData.subject ||
                !formData.course ||
                !formData.section ||
                formData.subject.trim() === "" ||
                formData.course.trim() === "" ||
                formData.section.trim() === ""}
            variant={'contained'}
            onClick={handleClick}
        >
            Add Section
        </Button>
    )
}