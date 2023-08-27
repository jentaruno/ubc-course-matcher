import {Box, Link, Typography, useTheme} from "@mui/material";
import React from "react";

export function UploadCalendarHelp() {
    const theme = useTheme();
    return <Box color={theme.palette.primary.light} mb={1}>
        <Typography sx={{fontSize: 'smaller'}}>
            <Box display={"inline"}>Find your Timetable on your </Box>
            <Link href="https://ssc.adm.ubc.ca/sscportal"
                  rel="noreferrer" target="_blank">SSC</Link>
            <Box display={"inline"}>, then click </Box>
            <Box sx={{fontStyle: "italic"}} display={"inline"}>
                Download your schedule to your calendar software
            </Box>
            . Upload it here, then hit Submit.
        </Typography>
    </Box>;
}