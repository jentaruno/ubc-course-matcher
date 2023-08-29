import {Checkbox, FormControlLabel, FormGroup, Grid} from "@mui/material";
import * as React from 'react';

export default function FriendsChecklist({friends, setFriends}) {

    const handleChange = (e, i) => {
        let newFriends = [...friends];
        newFriends[i] = {...newFriends[i], checked: e.target.checked};
        setFriends(newFriends);
    }

    return (
        <FormGroup>
            <Grid container columnSpacing={2}>
                {friends.map((friend, i) =>
                    <Grid
                        key={`checkbox-${friend.name}`}
                        item xs={6} md={4}
                    >
                        <FormControlLabel
                            control={<Checkbox checked={friend.checked}/>}
                            label={friend.name}
                            onChange={(e) => handleChange(e, i)}
                        />
                    </Grid>
                )}
            </Grid>
        </FormGroup>
    )
}