import {Stack} from "@mui/material";
import FriendBlock from "../components/friends/FriendBlock";
import {AddFriendButton} from "../components/friends/AddFriendButton";
import {useState} from "react";

const Friends = () => {
    const [friends, setFriends] = useState([]);

    function handleDelete(index) {
        let newFriends = friends;
        newFriends.splice(index, 1);
        setFriends(newFriends);
    }

    return <Stack spacing={3}>
        <h1>Friends</h1>
        {friends && friends?.length > 0
            ? friends.map((friend, i) =>
                <FriendBlock
                    key={i}
                    name={friend.name}
                    courses={friend.courseList}
                    handleDelete={() => handleDelete(i)}
                />
            )
            : 'Add friends with the (+) button.'
        }
        <AddFriendButton
            friends={friends}
            setFriends={setFriends}
        />
    </Stack>;
}

export default Friends;