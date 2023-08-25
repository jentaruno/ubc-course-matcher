import {Box, Grid, IconButton, Stack, Typography, useTheme} from "@mui/material";
import {Clear, PeopleAlt} from "@mui/icons-material";
import {getCalDays, getCalTimes} from "../../data/utilsCourse";
import React from "react";

export default function CourseBlock(
    {
        course,
        location,
        friends,
        classTimes,
        handleDelete,
    }
) {

    const theme = useTheme();
    const days = getCalDays(classTimes);
    const time = getCalTimes(classTimes);
    // TODO: days and times
    return (
        <Box sx={{p: '2px'}}>
            <Stack direction={'row'} spacing={2}>
                <Grid container spacing={0}>
                    <Grid item xs={8} overflow={'hidden'}>
                        <Typography sx={{fontWeight: 'bold'}}>{course}</Typography>
                    </Grid>
                    <Grid
                        item xs={4}
                        sx={{textAlign: 'right'}}
                        overflow={'hidden'} color={theme.palette.primary.light}

                    >
                        <Typography sx={{fontSize: 'smaller'}}>{days ?? ""}</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={8}
                        overflow={'hidden'}
                        color={theme.palette.primary.light}
                    >
                        {location && <Typography sx={{fontSize: 'smaller'}}>{location}</Typography>}
                    </Grid>
                    <Grid
                        item xs={4}
                        sx={{textAlign: 'right'}}
                        overflow={'hidden'}
                        color={theme.palette.primary.light}
                    >
                        <Typography sx={{fontSize: 'smaller'}}>{time ?? ""}</Typography>
                    </Grid>
                    {Array.isArray(friends) && friends.length > 0 &&
                        <Grid
                            item
                            xs={12}
                            overflow={'hidden'}
                        >
                            <Stack direction={'row'} spacing={1}>
                                <PeopleAlt/>
                                <Typography>{friends.join(", ")}</Typography>
                            </Stack>
                        </Grid>
                    }
                </Grid>
                {handleDelete && <IconButton onClick={handleDelete}>
                    <Clear/>
                </IconButton>}
            </Stack>
        </Box>
    )
}