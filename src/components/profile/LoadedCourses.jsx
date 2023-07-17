import CourseBlock from "../CourseBlock";
import React from "react";
import {Divider, Stack} from "@mui/material";

// TODO: placeholder when no courses loaded yet
export default function LoadedCourses({courses}) {
    return (
        <Stack
            direction={'column'}
            spacing={1}
            overflowY={'scroll'}
        >
            <h2>Loaded sections</h2>
            <Stack
                direction={'column'}
                spacing={1}
                divider={<Divider orientation="horizontal" flexItem/>}
            >
                {courses[0]?.courseList && courses[0].courseList.length > 0
                    ? courses[0].courseList.map((course) =>
                        <CourseBlock
                            course={course}
                            location={"Earth & Sciences Building"}
                            days={"Mon Wed Fri"}
                            time={"11.00-12.00"}
                        />
                    )
                    : <p>No courses loaded</p>}
            </Stack>
        </Stack>
    )
}