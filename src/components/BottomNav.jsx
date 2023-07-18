import {BottomNavigation, BottomNavigationAction, Box} from "@mui/material";
import {useState} from "react";
import {AccountCircle, Handshake, People, Today} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

export default function BottomNav() {

    const [value, setValue] = useState(2);
    const navigate = useNavigate();

    return (
        <Box
            style={{position: 'sticky', bottom: 0, borderTop: '1px solid #f5f5f5'}}
        >
            <BottomNavigation
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <BottomNavigationAction
                    label="You"
                    icon={<AccountCircle/>}
                    onClick={() => navigate('/profile')}
                />
                <BottomNavigationAction
                    label="Friends"
                    icon={<People/>}
                    onClick={() => navigate('/friends')}
                />
                <BottomNavigationAction
                    label="Match"
                    icon={<Handshake/>}
                    onClick={() => navigate('/match')}
                />
                <BottomNavigationAction
                    label="Meet"
                    icon={<Today/>}
                    onClick={() => navigate('/meet')}
                />
            </BottomNavigation>
        </Box>
    )
}