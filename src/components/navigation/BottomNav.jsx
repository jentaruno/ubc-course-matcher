import {BottomNavigation, BottomNavigationAction, Box} from "@mui/material";
import {useState} from "react";
import {AccountCircle, Handshake, People, Today} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";

export default function BottomNav() {
    const navigate = useNavigate();
    const currentLocation = useLocation();

    const pages = {
        profile: 0,
        friends: 1,
        match: 2,
        meet: 3
    }
    const currentPage = currentLocation.pathname.split('/')[1];
    const [value, setValue] = useState(pages[currentPage] || 0);

    return (
        <Box
            style={{
                position: 'sticky',
                bottom: 0,
                borderTop: '1px solid #e0e0e0',
            }}
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