import {Alert, Typography} from "@mui/material";

export default function FreeNow({friends}) {
    return (
        <Alert icon={false} severity="info">
            <Typography sx={{fontWeight: 'bold'}}>
                Currently not in class:
            </Typography>
            <Typography>
                {friends.join(", ")}
            </Typography>
        </Alert>
    )
}