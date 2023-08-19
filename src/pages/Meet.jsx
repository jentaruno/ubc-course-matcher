import React, {useState} from "react";
import {Stack} from "@mui/material";
import {MeetTable} from "../components/meet/MeetTable";
import useLocalStorage from "../data/useLocalStorage";

const Meet = () => {
    const [userData, setUserData] = useLocalStorage("user");
    const [friends, setFriends] = useState([
        {
            name: userData.name,
            courses: userData.courses,
        }
        , ...userData.friends
    ]);

    return <Stack>
        <h1>When to Meet</h1>
        {Array.isArray(friends) && friends.length > 0 &&
            <MeetTable friends={friends}/>}
    </Stack>;
}

export default Meet;