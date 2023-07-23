import {Button, InputLabel, Link, MenuItem, Select, Stack, TextField} from "@mui/material";
import React, {Suspense, useEffect, useState} from "react";
import {ArrowBack} from "@mui/icons-material";
import axios from "axios";
import * as cheerio from "cheerio";

export default function EditProfile() {
    // TODO: load name year level degree major from database
    // TODO: default profpic
    // TODO: implem ID

    const [formData, setFormData] = useState({
        name: '',
        yearLevel: 1,
        degree: '',
        major: '',
    });
    const [degreesData, setDegreesData] = useState([]);
    useEffect(() => {
        async function scrapeDegrees() {
            const url = "https://courses.students.ubc.ca/cs/courseschedule?pname=spec&tname=spec";
            const config = {
                headers: {
                    // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36',
                    'Accept-Language': 'en-US,en;q=0.9,ja-JP;q=0.8,ja;q=0.7'
                }

            }
            try {
                console.log('select')
                const response = await axios.get(url, config);
                const $ = cheerio.load(response.data);
                const listDegrees = $(".plainlist ul li");
                console.log(listDegrees);
                //const degrees = ["BA", "BSc"];
                setDegreesData(listDegrees);
            } catch (err) {
                console.log(err);
            }
        }

        scrapeDegrees();
    }, []);

    function handleChange(event) {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function handleSubmit() {
        // TODO: save to database
    }

    return (
        <Stack spacing={1} component={'form'}>
            <h1>
                <Link
                    href={'profile'}
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
            <Suspense fallback={<p>Loading...</p>}>
                <Select
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    variant="outlined"
                    required
                >
                    {degreesData.length > 0 && degreesData.map((e, i) =>
                        <MenuItem key={`degrees-${i}`} value={e}>{e}</MenuItem>
                    )}
                </Select>
            </Suspense>
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
                onClick={handleSubmit}
            >
                Save
            </Button>
        </Stack>
    );
}