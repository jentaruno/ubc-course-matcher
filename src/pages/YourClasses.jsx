import {Box, Link, Stack, Tab, Tabs} from "@mui/material";
import React, {useState} from "react";
import {UploadCalendar} from "../components/UploadCalendar";
import TypeManuallyTab from "../components/profile/TypeManuallyTab";
import LoadedCourses from "../components/profile/LoadedCourses";
import {ArrowBack} from "@mui/icons-material";

const YourClasses = () => {
    const [value, setValue] = useState(0);
    const userName = "User";
    // TODO: user name is loaded from login page
    // TODO: option to go back with saving / without saving
    // TODO: detect term from SSC?
    const [courses, setCourses] = useState([]);
    const [term, setTerm] = useState("Winter");

    return (
        <Box>
            <h1>
                <Link
                    href={'/profile'}
                    underline={'none'}
                >
                    <ArrowBack/>
                </Link>
                {' Your Classes'}
            </h1>
            <Stack spacing={3}>
                <Tabs
                    value={value}
                    onChange={(event, val) => setValue(val)}
                    aria-label={'input-type'}>
                    <Tab label="Calendar file" value={0}/>
                    <Tab label="Type manually" value={1}/>
                </Tabs>
                {value === 0
                    ? <UploadCalendar
                        setTerm={setTerm}
                        userName={userName}
                        courses={courses}
                        handleUpdate={setCourses}
                    />
                    : <TypeManuallyTab
                        courses={courses}
                    />}
                <Stack
                    direction={'column'}
                    spacing={1}
                    overflowY={'scroll'}
                >
                    <h2>Loaded sections</h2>
                    <LoadedCourses
                        courses={courses.courseList}
                    />
                </Stack>
            </Stack>
        </Box>
    );
}

export default YourClasses;