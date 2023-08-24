import React, {useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {MeetTable} from "../components/meet/MeetTable";
import useLocalStorage from "../data/useLocalStorage";
import FriendsChecklist from "../components/meet/FriendsChecklist";

const Meet = () => {
    const [userData, setUserData] = useLocalStorage("user");
    const [loading, setLoading] = useState(true);

    const friendsCheckbox = () => {
        const userBlock = {
            name: userData.name,
            courses: userData.courses,
            checked: true,
        };
        let userFriends = userData.friends;
        userFriends.map(e => e.checked = false);
        return [userBlock, ...userFriends];
    }
    const [friends, setFriends] = useState(friendsCheckbox());
    const [checkedFriends, setCheckedFriends] = useState(friendsCheckbox);

    useEffect(() => {
        const newFriends = [...friends].filter(e => e.checked);
        setCheckedFriends(newFriends);
        setLoading(true);
    }, [friends]);

    return <Stack>
        <h1>When to Meet</h1>
        <FriendsChecklist
            friends={friends}
            setFriends={setFriends}
        />
        {Array.isArray(friends) && friends.length > 0 &&
            <MeetTable
                friends={checkedFriends}
                loading={loading}
                setLoading={setLoading}
            />}
    </Stack>;
}

export default Meet;