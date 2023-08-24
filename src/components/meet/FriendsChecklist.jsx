import {Checkbox, FormControlLabel, FormGroup, Stack} from "@mui/material";

export default function FriendsChecklist({friends, setFriends}) {

    const handleChange = (e, i) => {
        let newFriends = [...friends];
        newFriends[i] = {...newFriends[i], checked: e.target.checked};
        setFriends(newFriends);
    }

    return (
        <FormGroup>
            <Stack direction={'row'} spacing={1}>
                {friends.map((friend, i) =>
                    <FormControlLabel
                        key={`checkbox-${friend.name}`}
                        control={<Checkbox value={friend.checked}/>}
                        label={friend.name}
                        onChange={(e) => handleChange(e, i)}
                    />
                )}
            </Stack>
        </FormGroup>
    )
}