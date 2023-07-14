import {Box, Grid} from "@mui/material";
import {LocationOn} from "@mui/icons-material";

export default function CourseBlock(
    {
        course,
        location,
        days,
        time,
    }
) {
    return (
        <Box sx={{p: '2px'}}>
            <Grid container spacing={0}>
                <Grid item xs={8}>
                    <b>{course}</b>
                </Grid>
                <Grid item xs={4} sx={{textAlign: 'right'}}>
                    {days}
                </Grid>
                <Grid item xs={8}>
                    <LocationOn/>
                    {location}
                </Grid>
                <Grid item xs={4} sx={{textAlign: 'right'}}>
                    {time}
                </Grid>
            </Grid>
        </Box>
    )
}