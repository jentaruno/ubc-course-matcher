import CourseBlock from "./CourseBlock";
import React from "react";
import {Divider, Stack, Typography} from "@mui/material";

// TODO: placeholder when no courses loaded yet
// TODO: refactor, change handleDelete to setCourses. add delete={true/false} prop. handle deletion internally
export default function LoadedCourses({courses, handleDelete}) {
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
                ? courses.map(({name, location, friends, classTimes}, i) =>
                    <CourseBlock
                        course={name}
                        location={location}
                        friends={friends}
                        classTimes={classTimes}
                        handleDelete={handleDelete ? () => handleDelete(i) : null}
                    />
                )
                : <Typography>No courses loaded</Typography>}
        </Stack>
    )
}