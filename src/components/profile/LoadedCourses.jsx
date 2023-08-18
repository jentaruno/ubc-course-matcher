import CourseBlock from "../CourseBlock";
import React from "react";
import {Divider, Stack} from "@mui/material";

// TODO: placeholder when no courses loaded yet
export default function LoadedCourses({courses}) {
    return (
        <Stack
            sx={{height: '100%', overflowY: 'scroll'}}
            direction={'column'}
            spacing={1}
            divider={<Divider
                variant={'fullWidth'}
                orientation="horizontal"
                flexItem
            />}
        >
            {courses && courses?.length > 0
                ? courses.map((course) =>
                    <CourseBlock
                        course={course}
                        location={"Earth & Sciences Building"}
                        days={"Mon Wed Fri"}
                        time={"11.00-12.00"}
                    />
                )
                : <p>No courses loaded</p>}
        </Stack>
    )
}