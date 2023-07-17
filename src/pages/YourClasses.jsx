import {Stack, Tab, Tabs} from "@mui/material";
import React, {useState} from "react";
import {CalendarFileTab} from "../components/profile/CalendarFileTab";
import TypeManuallyTab from "../components/profile/TypeManuallyTab";
import LoadedCourses from "../components/profile/LoadedCourses";
import {ArrowBack} from "@mui/icons-material";

const YourClasses = () => {
    const [value, setValue] = useState(0);
    const userName = "User";
    // TODO: user name is loaded from login page
    // TODO: option to go back with saving / without saving
    const [courses, setCourses] = useState([]);
    const [term, setTerm] = useState("Winter");

    return (
        <Stack spacing={2}>
            <h1><ArrowBack/> Your Classes</h1>
            <Tabs
                value={value}
                onChange={(event, val) => setValue(val)}
                aria-label={'input-type'}>
                <Tab label="Calendar file" value={0}/>
                <Tab label="Type manually" value={1}/>
            </Tabs>
            {value === 0
                ? <CalendarFileTab
                    setTerm={setTerm}
                    userName={userName}
                    courses={courses}
                    setCourses={setCourses}
                />
                : <TypeManuallyTab
                    courses={courses}
                />}
            <LoadedCourses
                courses={courses}
            />
        </Stack>
    );
}

export default YourClasses;