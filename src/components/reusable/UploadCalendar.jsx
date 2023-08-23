import {Button, Stack} from "@mui/material";
import React, {useState} from "react";

export function UploadCalendar(
    {
        setTerm,
        handleUpdate,
    }
) {
    const [courseFiles, setCourseFiles] = useState([]);

    // TODO: handle error reading file

    function handleUpload(e) {
        let file = e.target.files[0];
        let newCourses = [];
        let reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            newCourses[0] = {file: reader.result};
        };
        reader.onerror = function () {
            console.error(reader.error);
        };
        setCourseFiles(newCourses);
        //userErrorMessage: ""
    }

    function handleSubmitFile() {
        // TODO: visible error msg
        try {
            const newCourses = readCourses();
            handleUpdate(newCourses);
        } catch (e) {
            console.error(e);
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
        const day = section.substring(dayIndex + 6, dayIndex + 8);

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
        let splitFiles = courseFiles.map(e => e.file.split('BEGIN:VEVENT'));
        let slicedFiles = sliceCurrentTerm(splitFiles[0]);
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
        <input
            type="file"
            id="user-file"
            accept=".ics"
            className="form-control"
            onChange={(e) => handleUpload(e)}
        />
        <Button
            variant={'contained'}
            onClick={handleSubmitFile}
        >
            Submit
        </Button>
    </Stack>;
}