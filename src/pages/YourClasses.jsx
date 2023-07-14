import {Box, Tab, Tabs} from "@mui/material";
import React, {useState} from "react";
import CourseBlock from "../components/CourseBlock";

const YourClasses = () => {
    const [value, setValue] = useState(0);

    function handleUpload(e) {
        // TODO: handle upload
    }

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
            <Box sx={{mt: '1rem'}}>
                {
                    value === 0
                        ?
                        <Box>
                            <input
                                type="file"
                                id='user-file'
                                accept=".ics"
                                className="form-control"
                                onChange={(e) => handleUpload(e)}
                            />
                            <CourseBlock
                                course={'CPSC 121 102'}
                                location={'Earth & Sciences Building'}
                                days={'Mon Wed Fri'}
                                time={'11.00-12.00'}
                            />
                        </Box>
                        :
                        <Box>

                        </Box>
                }
            </Box>
        </Box>
    );
}

export default YourClasses;