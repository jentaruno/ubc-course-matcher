import React, {useEffect, useRef, useState} from "react";
import {Stack, Typography} from "@mui/material";
import {MeetTable} from "../components/meet/MeetTable";
import useLocalStorage from "../data/useLocalStorage";
import hasCoursesAndFriends from "../data/utilsLocalStorage";
import FreeNow from "../components/meet/FreeNow";
import {getCurrentTimeInterval} from "../data/utilsCourse";
import CustomizedAccordions from "../components/meet/Drawer";

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
    const [blocksShades, setBlocksShades] = useState([]);
    const container = useRef(null);

    useEffect(() => {
        const newFriends = [...friends].filter(e => e.checked);
        setCheckedFriends(newFriends);
        setLoading(true);
    }, [friends]);

    const getFreeFriends = () => {
        const currentTime = getCurrentTimeInterval();
        const shadeBlock = blocksShades[currentTime];
        const friendNames = friends.map(e => e.name);
        if (shadeBlock && shadeBlock.friends) {
            const complement = [];
            for (const item of friendNames) {
                if (!shadeBlock.friends.includes(item)) {
                    complement.push(item);
                }
            }
            return complement;
        } else {
            return friendNames;
        }
    }
    const freeFriends = getFreeFriends();

    return (
        <Stack spacing={2} ref={container}>
            <Typography variant={'h4'}>When to Meet</Typography>
            {(hasCoursesAndFriends(userData) && container && container.current)
                ? <Stack spacing={2}>
                    <FreeNow friends={freeFriends}/>
                    <CustomizedAccordions
                        friends={friends}
                        setFriends={setFriends}
                    />
                    {Array.isArray(friends) && friends.length > 0 &&
                        <MeetTable
                            friends={checkedFriends}
                            blocksShades={blocksShades}
                            setBlocksShades={setBlocksShades}
                            loading={loading}
                            setLoading={setLoading}
                        />
                    }
                    <Stack>
                    </Stack>
                </Stack>
                : <Typography>
                    To start using the when2meet, upload your classes and your friends' on the Profile and Friends tabs!
                </Typography>
            }
        </Stack>
    );
}

export default Meet;