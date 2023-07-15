import {Box, Grid, Stack} from "@mui/material";
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
                <Grid item xs={8} overflow={'hidden'}>
                    <b>{course}</b>
                </Grid>
                <Grid
                    item xs={4}
                    sx={{textAlign: 'right'}}
                    overflow={'hidden'}
                >
                    {days}
                </Grid>
                <Grid item xs={8} overflow={'hidden'}>
                    <Stack direction={'row'}>
                        <LocationOn/>
                        <span>{location}</span>
                    </Stack>
                </Grid>
                <Grid
                    item xs={4}
                    sx={{textAlign: 'right'}}
                    overflow={'hidden'}
                >
                    {time}
                </Grid>
            </Grid>
        </Box>
    )
}