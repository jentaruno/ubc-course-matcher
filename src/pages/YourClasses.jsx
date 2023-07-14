import {Box, Tab, Tabs} from "@mui/material";
import {useState} from "react";

const YourClasses = () => {
    const [value, setValue] = useState(0);

    return (
        <Box>
            <h1>Your Classes</h1>
            <Tabs
                value={value}
                onChange={(event, val) => setValue(val)}
                aria-label={'input-type'}>
                <Tab label="Calendar file" value={0}/>
                <Tab label="Type manually" value={1}/>
            </Tabs>
            {
                value === 0
                    ?
                    <Box>
                    </Box>
                    :
                    <Box>

                    </Box>
            }
        </Box>
    );
}

export default YourClasses;