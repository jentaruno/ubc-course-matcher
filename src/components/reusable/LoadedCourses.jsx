import CourseBlock from "./CourseBlock";
import React from "react";
import {Divider, Stack} from "@mui/material";

// TODO: placeholder when no courses loaded yet
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
                : <p>No courses loaded</p>}
        </Stack>
    )
}