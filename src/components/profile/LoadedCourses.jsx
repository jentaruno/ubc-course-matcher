import CourseBlock from "../CourseBlock";
import React from "react";
import {Box} from "@mui/material";

export default function LoadedCourses({courses, setCourses}) {
    return (
        <Box>
            <h2>Loaded courses</h2>
            <CourseBlock
                course={"CPSC 121 102"}
                location={"Earth & Sciences Building"}
                days={"Mon Wed Fri"}
                time={"11.00-12.00"}
            />
        </Box>
    )
}