import {Stack} from "@mui/material";
import FriendBlock from "../components/friends/FriendBlock";
import {AddFriendButton} from "../components/friends/AddFriendButton";
import useLocalStorage from "../data/useLocalStorage";
import {useState} from "react";

const Friends = () => {
    const [userData, setUserData] = useLocalStorage("user");
    const [friends, setFriends] = useState(userData.friends);

    const handleAddFriend = (friend) => {
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
        <h1>Friends</h1>
        {friends && friends?.length > 0
            ? friends.map((friend, i) =>
                <FriendBlock
                    key={i}
                    name={friend.name}
                    courses={friend.courses}
                    handleDelete={() => handleDeleteFriend(i)}
                />
            )
            : 'Add friends with the (+) button.'
        }
        <AddFriendButton
            handleAddFriend={handleAddFriend}
            friends={friends}
            setFriends={setFriends}
        />
    </Stack>;
}

export default Friends;