import CourseBlock from "./CourseBlock";
import React from "react";
import {Divider, Stack, Typography} from "@mui/material";

// TODO: placeholder when no courses loaded yet
// TODO: refactor, change handleDelete to setCourses. add delete={true/false} prop. handle deletion internally
export default function LoadedCourses({courses, handleDelete}) {
    return (courses && courses?.length > 0
            ? <Stack
                sx={{height: '100%', overflowY: 'hidden'}}
                spacing={2}
            >
                <Typography>
                    {courses.length} sections loaded
                </Typography>
                <Stack
                    sx={{height: '100%', overflowY: 'auto'}}
                    direction={'column'}
                    spacing={1}
                    divider={<Divider
                        variant={'fullWidth'}
                        orientation="horizontal"
                        flexItem
                    />}
                >
                    {courses.map(({name, location, friends, classTimes}, i) =>
                        <CourseBlock
                            key={`course-${name}`}
                            course={name}
                            location={location}
                            friends={friends}
                            classTimes={classTimes}
                            handleDelete={handleDelete ? () => handleDelete(i) : null}
                        />
                    )}
                </Stack>
            </Stack>
            : <Typography>No courses loaded</Typography>
    )
}