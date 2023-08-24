import {Box, Link, Stack, Tab, Tabs} from "@mui/material";
import React, {useState} from "react";
import {UploadCalendar} from "../components/reusable/UploadCalendar";
import TypeCourseManually from "../components/reusable/TypeCourseManually";
import LoadedCourses from "../components/reusable/LoadedCourses";
import {ArrowBack} from "@mui/icons-material";
import useLocalStorage from "../data/useLocalStorage";

const YourClasses = () => {
    const [tab, setTab] = useState(0);
    // TODO: user name is loaded from login page
    // TODO: option to go back with saving / without saving
    // TODO: detect term from SSC?
    const [userData, setUserData] = useLocalStorage("user");
    const [term, setTerm] = useState("Winter");

    const handleDeleteCourse = (i) => {
        const newCourses = [...userData.courses];
        newCourses.splice(i, 1);
        setUserData({courses: newCourses});
    }

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
                        handleUpdate={setUserData}
                    />
                    : <TypeCourseManually
                        courses={userData.courses ?? []}
                        handleUpdate={(c) => setUserData({courses: c})}
                    />}
                <Stack
                    direction={'column'}
                    spacing={1}
                    overflowY={'scroll'}
                >
                    <h2>Loaded sections</h2>
                    {userData && userData.courses &&
                        <div>
                            <p>
                                {userData.courses.length
                                    + " "
                                    + term
                                    + " sections"
                                }
                            </p>
                            <LoadedCourses
                                courses={userData.courses}
                                handleDelete={handleDeleteCourse}
                            />
                        </div>
                    }
                </Stack>
            </Stack>
        </Box>
    );
}

export default YourClasses;