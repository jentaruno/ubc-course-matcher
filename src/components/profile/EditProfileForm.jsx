import {InputLabel, MenuItem, Select, Stack, TextField, Typography} from "@mui/material";
import React from "react";
import * as PropTypes from "prop-types";

export function EditProfileForm(props) {
    return <Stack spacing={1}>
        <InputLabel id="name" required>
            Name
        </InputLabel>
        <TextField
            name="name"
            value={props.formData.name}
            onChange={props.onChange}
            variant="outlined"
            required
        />
        <InputLabel id="year-level" required>
            Year Level
        </InputLabel>
        <Select
            variant="outlined"
            value={props.formData.yearLevel}
            name="yearLevel"
            onChange={props.onChange}
        >
            {Array.from({length: 7}, (_, index) => index + 1)
                .map(e => <MenuItem key={`year-level-${e}`} value={e}>{e}</MenuItem>)
            }
        </Select>
        <InputLabel id="degree" required>
            Degree
        </InputLabel>
        {props.degrees
            ? props.degrees.length === 0
                ? <Typography>Loading...</Typography>
                : <Select
                    name="degree"
                    value={props.formData.degree}
                    onChange={props.onChange}
                    variant="outlined"
                    required
                >
                    {props.degrees.map((degree, i) =>
                        <MenuItem
                            key={`degree-${i}`}
                            value={degree}
                        >
                            {degree}
                        </MenuItem>
                    )}
                </Select>
            : <Typography className={"text-danger"}>Error fetching data</Typography>
        }
        <InputLabel id="major" required>
            Major
        </InputLabel>
        <TextField
            name="major"
            value={props.formData.major}
            onChange={props.onChange}
            variant="outlined"
            required
        />
    </Stack>;
}

EditProfileForm.propTypes = {
    formData: PropTypes.any,
    onChange: PropTypes.func,
    degrees: PropTypes.any,
};