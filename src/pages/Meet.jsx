import React, {useEffect, useState} from "react";
import {Stack, Typography} from "@mui/material";
import {MeetTable} from "../components/meet/MeetTable";
import useLocalStorage from "../data/useLocalStorage";
import FriendsChecklist from "../components/meet/FriendsChecklist";
import hasCoursesAndFriends from "../data/utilsLocalStorage";

const Meet = () => {
    // TODO: make overflow scroll work only on table
    const [userData, setUserData] = useLocalStorage("user");
    const [loading, setLoading] = useState(true);
    const friendsCheckbox = () => {
        if (!userData.friends || userData.friends.length === 0) {
            return [];
        }
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
    const [checkedFriends, setCheckedFriends] = useState(friendsCheckbox());

    useEffect(() => {
        const newFriends = [...friends].filter(e => e.checked);
        setCheckedFriends(newFriends);
        setLoading(true);
    }, [friends]);

    return (
        <Stack>
            <Typography variant={'h4'}>When to Meet</Typography>
            {hasCoursesAndFriends(userData)
                ? <Stack>
                    <FriendsChecklist
                        friends={friends}
                        setFriends={setFriends}
                    />
                    {Array.isArray(friends) && friends.length > 0 &&
                        <MeetTable
                            friends={checkedFriends}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    }
                </Stack>
                : <Typography>
                    To start using the when2meet, upload your classes and your friends' on the Profile and Friends tabs!
                </Typography>
            }
        </Stack>
    );
}

export default Meet;