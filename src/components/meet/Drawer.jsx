import * as React from 'react';
import Typography from '@mui/material/Typography';
import {Accordion, AccordionDetails, AccordionSummary, Box, Stack} from "@mui/material";
import FriendsChecklist from "./FriendsChecklist";
import {ArrowDropDown, Groups} from "@mui/icons-material";

export default function CustomizedAccordions({friends, setFriends}) {
    return (
        <Box sx={{
            position: 'sticky',
            top: 0,
        }}>
            <Accordion defaultExpanded={true}>
                <AccordionSummary
                    expandIcon={<ArrowDropDown/>}
                    aria-controls="panel-content"
                    id="panel-header"
                >
                    <Stack direction={'row'} spacing={1}>
                        <Groups/>
                        <Typography>
                            {friends.filter(e => e.checked).map(e => e.name).join(", ")}
                        </Typography>
                    </Stack>
                </AccordionSummary>
                <AccordionDetails>
                    <FriendsChecklist
                        friends={friends}
                        setFriends={setFriends}
                    />
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
