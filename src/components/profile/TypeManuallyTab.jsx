import {Button, Stack} from "@mui/material";
import React, {useState} from "react";

export default function TypeManuallyTab() {

    const [course, setCourse] = useState({});

    function handleType(e) {
        // TODO: suggest autofill
    }

    function handleAdd() {
        // TODO: add course to the courses array
    }

    return (
        <Stack spacing={1}>
            <input
                type="text"
                id="input-course"
                className="form-control"
                onChange={(e) => handleType(e)}
            />
            <Button
                variant={'contained'}
                onClick={handleAdd}
            >
                Add Course
            </Button>
        </Stack>
    );
}