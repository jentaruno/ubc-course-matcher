import {Button, Stack, Typography, useTheme} from "@mui/material";
import React, {useState} from "react";
import {convertDay} from "../../data/utilsCourse";
import {MuiFileInput} from "mui-file-input";
import AlertToast from "./AlertToast";

export function UploadCalendar(
    {
        setTerm,
        handleUpdate,
    }
) {
    const theme = useTheme();
    const [courseFiles, setCourseFiles] = useState(null);
    const [file, setFile] = useState(null);
    const [openError, setOpenError] = useState(false);
    const [openErrorNotIcs, setOpenErrorNotIcs] = useState(false);

    const handleChange = (newFile) => {
        const path = newFile.name.split('.');
        const extension = `${path[path.length - 1]}`;

        if (["ical", "ics", "ifb", "icalendar"].some(e => e === extension)) {
            setFile(newFile);
            handleUpload(newFile);
        } else {
            setOpenErrorNotIcs(true);
            setFile(null);
        }
    }

    function handleUpload(file) {
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            setCourseFiles(reader.result);
        };
        reader.onerror = function () {
            setOpenError(true);
            console.error(reader.error);
        };
    }

    function handleSubmitFile() {
        try {
            const newCourses = readCourses();
            handleUpdate(newCourses);
        } catch (e) {
            console.error(e);
            setOpenError(true);
        }
    }

    // Takes 1 calendar event and returns course object
    function parseSection(section) {
        const nameIndex = section.indexOf("SUMMARY:");
        const name = section.substring(nameIndex + 8, nameIndex + 20);

        const location = section.substring(
            section.indexOf("LOCATION:") + 9,
            section.indexOf(", Room") - 1);

        const dayIndex = section.indexOf("BYDAY=");
        const dayCode = section.substring(dayIndex + 6, dayIndex + 8);
        const day = convertDay(dayCode);

        const startIndex = section.indexOf("DTSTART;");
        const startTime = section.substring(startIndex + 40, startIndex + 42)
            + ":"
            + section.substring(startIndex + 42, startIndex + 44);

        const endIndex = section.indexOf("DTEND;");
        const endTime = section.substring(endIndex + 38, endIndex + 40)
            + ":"
            + section.substring(endIndex + 40, endIndex + 42);

        return {
            name: name,
            location: location,
            classTimes: [{
                day: day,
                start: startTime,
                end: endTime
            }]
        };
    }

    function readCourses() {
        let splitFiles = courseFiles.split('BEGIN:VEVENT');
        let slicedFiles = sliceCurrentTerm(splitFiles);
        let currentTermFiles = [];
        for (let i = 0; i < slicedFiles.length; i++) {
            slicedFiles[i].split("\n").map(e => currentTermFiles.push(e));
        }

        let parsedSections = {};
        slicedFiles.map((section) => {
            const newSection = parseSection(section);
            // Add to parsed courses, merge days and times if duplicate
            if (parsedSections[newSection.name]) {
                const existing = parsedSections[newSection.name];
                existing.classTimes.push(newSection.classTimes[0]);
            } else {
                parsedSections[newSection.name] = newSection;
            }
            return section;
        });

        //Change state of courses data
        const sectionsArray = Object.values(parsedSections);
        // TODO: refactor, return array only
        return {courses: sectionsArray};
    }

    function sliceCurrentTerm(splitFile) {
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let winter = splitFile.filter(e => e.includes("UNTIL=" + currentYear));
        let fall = splitFile.filter(e => e.includes("UNTIL=" + (currentYear + 1)));
        if (winter.length > 0) {
            setTerm("Winter");
            return winter;
            // let winterCourses = [];
            // for (let i = 0; i < winter.length; i++) {
            //     winter[i].split("\n").map(e => winterCourses.push(e));
            // }
            // return winterCourses;
        } else {
            setTerm("Fall");
            return fall;
            // let fallCourses = [];
            // for (let i = 0; i < fall.length; i++) {
            //     fall[i].split("\n").map(e => fallCourses.push(e));
            // }
            // return fallCourses;
        }
    }

    return <Stack spacing={1}>
        <MuiFileInput
            value={file}
            onChange={handleChange}
            hideSizeText
            placeholder="Upload a calendar file"
        />
        <Button
            disabled={!courseFiles}
            variant={'contained'}
            onClick={handleSubmitFile}
        >
            Submit
        </Button>
        <Typography
            sx={{fontSize: 'smaller', fontStyle: 'italic'}}
            color={theme.palette.primary.light}
        >
            Note: Calendar upload is not supported for some mobile devices.
        </Typography>
        <AlertToast
            open={openErrorNotIcs}
            setOpen={setOpenErrorNotIcs}
            variant={'warning'}
            message={'Please upload an iCalendar file.'}
        />
        <AlertToast
            open={openError}
            setOpen={setOpenError}
            variant={'error'}
            message={'Error reading file.'}
        />
    </Stack>;
}