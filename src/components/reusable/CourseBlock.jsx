import {Box, Grid, IconButton, Stack, useTheme} from "@mui/material";
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
                        {location && <small>{location}</small>}
                    </Grid>
                    <Grid
                        item xs={4}
                        sx={{textAlign: 'right'}}
                        overflow={'hidden'}
                        color={theme.palette.primary.light}
                    >
                        <small>{time ?? ""}</small>
                    </Grid>
                    {Array.isArray(friends) && friends.length > 0 &&
                        <Grid
                            item
                            xs={12}
                            overflow={'hidden'}
                        >
                            <Stack direction={'row'} spacing={1}>
                                <PeopleAlt/>
                                <span>{friends.join(", ")}</span>
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