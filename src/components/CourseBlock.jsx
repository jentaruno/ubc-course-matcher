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
    function convertDay(day) {
        switch (day) {
            case "MO":
                return "Mon";
            case "TU":
                return "Tue";
            case "WE":
                return "Wed";
            case "TH":
                return "Thu";
            case "FR":
                return "Fri";
            default:
                return "";
        }
    }

    const theme = useTheme();
    // TODO: days and times
    return (
        <Box sx={{p: '2px'}}>
            <Grid container spacing={0}>
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
                {friends &&
                    <Grid
                        item
                        xs={12}
                        overflow={'hidden'}
                        // mt={1}
                    >
                        <Stack direction={'row'} spacing={1}>
                            <PeopleAlt/>
                            <span>{friends}</span>
                        </Stack>
                    </Grid>
                }
            </Grid>
        </Box>
    )
}