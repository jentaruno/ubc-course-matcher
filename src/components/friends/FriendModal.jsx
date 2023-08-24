import {Box, IconButton, Modal, Stack} from "@mui/material";
import {Close} from "@mui/icons-material";
import LoadedCourses from "../reusable/LoadedCourses";
import React from "react";
import * as PropTypes from "prop-types";
import {ModalBox} from "../reusable/ModalBox";

export function FriendModal(props) {
    // TODO: timetable view
    return <Modal
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <ModalBox>
            <Stack
                direction={"column"}
                spacing={1}
            >
                <Stack direction={"row"} justifyContent={"space-between"}>
                    <h2>{props.name}'s sections</h2>
                    <IconButton
                        aria-label={"close"}
                        onClick={props.onClose}
                    >
                        <Close/>
                    </IconButton>
                </Stack>
                <Box height={"50vh"}>
                    <LoadedCourses courses={props.courses}/>
                </Box>
            </Stack>
        </ModalBox>
    </Modal>;
}

FriendModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    name: PropTypes.any,
    courses: PropTypes.any
};