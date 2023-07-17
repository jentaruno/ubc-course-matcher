import CourseBlock from "../CourseBlock";
import React, {useEffect} from "react";
import {Box} from "@mui/material";

// TODO: placeholder when no courses loaded yet
export default function LoadedCourses({courses}) {
    useEffect(() => {
        console.log('Courses prop changed:', courses);
        // Perform any additional actions based on the updated courses prop
    }, [courses]);
    return (
        <Box overflowY={'scroll'}>
            <h2>Loaded sections</h2>
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
        </Box>
    )
}