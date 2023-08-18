import {Box, Link, Stack, Tab, Tabs} from "@mui/material";
import React, {useState} from "react";
import {UploadCalendar} from "../components/UploadCalendar";
import TypeManuallyTab from "../components/profile/TypeManuallyTab";
import LoadedCourses from "../components/profile/LoadedCourses";
import {ArrowBack} from "@mui/icons-material";
import useLocalStorage from "../data/useLocalStorage";

const YourClasses = () => {
    const [tab, setTab] = useState(0);
    // TODO: user name is loaded from login page
    // TODO: option to go back with saving / without saving
    // TODO: detect term from SSC?
    const [userData, setUserData] = useLocalStorage("user");
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
                    value={tab}
                    onChange={(event, val) => setTab(val)}
                    aria-label={'input-type'}>
                    <Tab label="Calendar file" value={0}/>
                    <Tab label="Type manually" value={1}/>
                </Tabs>
                {tab === 0
                    ? <UploadCalendar
                        setTerm={setTerm}
                        courses={userData}
                        handleUpdate={setUserData}
                    />
                    : <TypeManuallyTab
                        courses={userData}
                    />}
                <Stack
                    direction={'column'}
                    spacing={1}
                    overflowY={'scroll'}
                >
                    <h2>Loaded sections</h2>
                    {userData && userData.courseList &&
                        <div>
                            <p>
                                {userData.courseList.length
                                    + " "
                                    + term
                                    + " sections"
                                }
                            </p>
                            <LoadedCourses
                                courses={userData.courseList}
                            />
                        </div>
                    }
                </Stack>
            </Stack>
        </Box>
    );
}

export default YourClasses;