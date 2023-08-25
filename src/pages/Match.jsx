import {Stack, Tab, Tabs, Typography} from "@mui/material";
import MatchSections from "../components/match/matchSections";
import MatchCourses from "../components/match/matchCourses";
import React, {useState} from "react";
import useLocalStorage from "../data/useLocalStorage";

const Match = () => {
    // TODO: check when no friends
    const [userData, setUserData] = useLocalStorage("user");
    const [tab, setTab] = useState(0);

    const canMatch = () => {
        return userData.courses
            && userData.courses.length > 0
            && userData.friends
            && userData.friends.length > 0;
    }

    return <div>
        <Typography variant={'h4'}>Course Match</Typography>
        {canMatch &&
            <Stack direction={'column'} spacing={2}>
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
            </Stack>}
    </div>;
}

export default Match;