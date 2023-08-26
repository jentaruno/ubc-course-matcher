import {Stack, Tab, Tabs, Typography} from "@mui/material";
import MatchSections from "../components/match/matchSections";
import MatchCourses from "../components/match/matchCourses";
import React, {useState} from "react";
import useLocalStorage from "../data/useLocalStorage";
import hasCoursesAndFriends from "../data/utilsLocalStorage";

const Match = () => {
    // TODO: check when no friends
    const [userData, setUserData] = useLocalStorage("user");
    const [tab, setTab] = useState(0);

    return <div>
        <Typography variant={'h4'}>Course Match</Typography>
        {hasCoursesAndFriends(userData)
            ? <Stack direction={'column'} spacing={2}>
                <Tabs
                    value={tab}
                    onChange={(event, val) => setTab(val)}
                    aria-label={'input-type'}>
                    <Tab label="Sections" value={0}/>
                    <Tab label="Courses" value={1}/>
                </Tabs>
                {tab === 0
                    ? <MatchSections/>
                    : <MatchCourses/>}
            </Stack>
            : <Typography>
                To start course matching, upload your classes and your friends' on the Profile and Friends tabs!
            </Typography>
        }
    </div>;
}

export default Match;