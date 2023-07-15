import {Box, Stack, Tab, Tabs} from "@mui/material";
import React, {useState} from "react";
import {CalendarFileTab} from "../components/profile/CalendarFileTab";
import TypeManuallyTab from "../components/profile/TypeManuallyTab";
import {ShareQRButton} from "../components/profile/ShareQRButton";
import LoadedCourses from "../components/profile/LoadedCourses";

const YourClasses = () => {
    const [value, setValue] = useState(0);
    const userName = "User";
    const [userCourses, setUserCourses] = useState("");
    const [courseFiles, setCourseFiles] = useState([]);
    const [courses, setCourses] = useState([]);
    const [term, setTerm] = useState("Winter");

    function shareQRCode() {

    }

    return (
        <Box>
            <h1>Your Classes</h1>
            <Stack spacing={2}>
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
                        userCourses={userCourses}
                        setUserCourses={setUserCourses}
                        courseFiles={courseFiles}
                        setCourseFiles={setCourseFiles}
                        courses={courses}
                        setCourses={setCourses}
                    />
                    : <TypeManuallyTab
                        courses={courses}
                    />}
                <LoadedCourses
                    courses={courses}
                    setCourses={setCourses}
                />
                <ShareQRButton
                    onShare={shareQRCode}
                />
            </Stack>
        </Box>
    );
}

export default YourClasses;