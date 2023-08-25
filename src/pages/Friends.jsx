import {Stack, Typography} from "@mui/material";
import FriendBlock from "../components/friends/FriendBlock";
import {AddFriendButton} from "../components/friends/AddFriendButton";
import useLocalStorage from "../data/useLocalStorage";
import {useState} from "react";

const Friends = () => {
    const [userData, setUserData] = useLocalStorage("user");
    const [friends, setFriends] = useState(userData.friends);

    const handleAddFriend = (friend) => {
        // TODO: prevent duplicates and adding self
        const loadedFriends = friends ?? [];
        const newFriends = [...loadedFriends];
        newFriends.push(friend);
        setFriends(newFriends);
        setUserData({friends: newFriends});
    }
    const handleDeleteFriend = (index) => {
        const newFriends = [...friends];
        newFriends.splice(index, 1);
        setFriends(newFriends);
        setUserData({friends: newFriends});
    }

    return <Stack spacing={3}>
        <Typography variant={'h4'}>Friends</Typography>
        {friends && friends?.length > 0
            ? friends.map((friend, i) =>
                <FriendBlock
                    key={i}
                    name={friend.name}
                    courses={friend.courses}
                    handleDelete={() => handleDeleteFriend(i)}
                />
            )
            : <Typography>Add friends with the (+) button.</Typography>
        }
        <AddFriendButton
            handleAddFriend={handleAddFriend}
            friends={friends}
            setFriends={setFriends}
        />
    </Stack>;
}

export default Friends;