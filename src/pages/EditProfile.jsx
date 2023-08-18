import {Button, InputLabel, Link, MenuItem, Select, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {ArrowBack} from "@mui/icons-material";
import useDegrees from "../data/useDegrees";
import useLocalStorage from "../data/useLocalStorage";

export default function EditProfile() {
    // TODO: default profpic
    // TODO: implem ID

    const [userData, setUserData] = useLocalStorage("user");
    const [formData, setFormData] = useState(userData ?? {
        name: 'UBC Student',
        yearLevel: 1,
        courses: [],
        classTimes: [],
    });
    const degrees = useDegrees();

    function handleChange(event) {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function saveUserData() {
        setUserData(formData);
    }

    return (
        <Stack spacing={1} component={'form'}>
            <h1>
                <Link
                    href={'/profile'}
                    underline={'none'}
                >
                    <ArrowBack/>
                </Link>
                {' Edit Profile'}
            </h1>

            <InputLabel id={'photo'}>

            </InputLabel>

            <InputLabel id="name" required>
                Name
            </InputLabel>
            <TextField
                name="name"
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                required
            />
            <InputLabel id="year-level" required>
                Year Level
            </InputLabel>
            <Select
                variant="outlined"
                value={formData.yearLevel}
                name='yearLevel'
                onChange={handleChange}
            >
                {Array.from({length: 7}, (_, index) => index + 1)
                    .map(e => <MenuItem key={`year-level-${e}`} value={e}>{e}</MenuItem>)
                }
            </Select>
            <InputLabel id="degree" required>
                Degree
            </InputLabel>
            {degrees
                ? degrees.length === 0
                    ? <p>Loading...</p>
                    : <Select
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        variant="outlined"
                        required
                    >
                        {degrees.map((degree, i) =>
                            <MenuItem
                                key={`degree-${i}`}
                                value={degree}
                            >
                                {degree}
                            </MenuItem>
                        )}
                    </Select>
                : <p className={'text-danger'}>Error fetching data</p>
            }
            <InputLabel id="major" required>
                Major
            </InputLabel>
            <TextField
                name="major"
                value={formData.major}
                onChange={handleChange}
                variant="outlined"
                required
            />
            <Button
                variant="contained"
                color="primary"
                onClick={saveUserData}
            >
                Save
            </Button>
        </Stack>
    );
}