import {Box, Grid, Stack, useTheme} from "@mui/material";
import {PeopleAlt} from "@mui/icons-material";

export default function CourseBlock(
    {
        course,
        location,
        days,
        time,
        friends,
    }
) {
    const theme = useTheme();
    // TODO: days and times
    return (
        <Box sx={{p: '2px'}}>
            <Grid container spacing={0}>
                {friends &&
                    <Grid
                        item
                        xs={12}
                        overflow={'hidden'}
                        mb={1}
                    >
                        <Stack direction={'row'} spacing={1}>
                            <PeopleAlt/>
                            <span>{friends}</span>
                        </Stack>
                    </Grid>
                }
                <Grid item xs={8} overflow={'hidden'}>
                    <b>{course}</b>
                </Grid>
                <Grid
                    item xs={4}
                    sx={{textAlign: 'right'}}
                    overflow={'hidden'} color={theme.palette.primary.light}

                >
                    <small>{days ?? ""}</small>
                </Grid>
                <Grid
                    item
                    xs={8}
                    overflow={'hidden'}
                    color={theme.palette.primary.light}
                >
                    {location &&
                        <Stack direction={'row'} spacing={1}>
                            <small>{location}</small>
                        </Stack>
                    }
                </Grid>
                <Grid
                    item xs={4}
                    sx={{textAlign: 'right'}}
                    overflow={'hidden'}
                    color={theme.palette.primary.light}
                >
                    <small>{time ?? ""}</small>
                </Grid>
            </Grid>
        </Box>
    )
}