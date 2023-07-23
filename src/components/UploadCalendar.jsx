import {Button, Stack} from "@mui/material";
import React, {useState} from "react";

export function UploadCalendar(
    {
        setTerm,
        userName,
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
            console.log(reader.error);
        };
        setCourseFiles(newCourses);
        //userErrorMessage: ""
    }

    function handleSubmitFile() {
        const newCourses = readCourses();
        //saveCookies(courses[0].key, courses[0].courseList, courses[0].classTimes);
        handleUpdate(newCourses);
    }

    function readCourses() {
        let splitFiles = courseFiles.map(e => e.file.split('BEGIN:VEVENT'));
        let currentTermFiles = sliceCurrentTerm(splitFiles[0]);

        //Read courses one by one
        let extractedCourses = currentTermFiles.filter(e => e.includes("SUMMARY"))
            .filter((v, i, a) => a.indexOf(v) === i)
            .map(e => e.substring(8, 20));

        //Read times that student is in class
        let extractedClassDays = currentTermFiles.filter(e => e.includes("BYDAY"))
            .map(e => e.slice(e.lastIndexOf("BYDAY") + 6).replace("\r", "")).map((e) => dayToNum(e));
        let extractedClassStartTimes = currentTermFiles.filter(e => e.includes("DTSTART;"))
            .map(e => e.substring(40, 42) + ":" + e.substring(42, 44));
        let extractedClassEndTimes = currentTermFiles.filter(e => e.includes("DTEND;"))
            .map(e => e.substring(38, 40) + ":" + e.substring(40, 42));

        let extractedClassTimes = extractedClassDays.map((e, i) =>
            e + extractedClassStartTimes[i].toString() + "-" + extractedClassEndTimes[i].toString())
            .filter((v, i, a) => a.indexOf(v) === i);

        //Change state of courses data
        return {
            name: userName,
            courseList: extractedCourses,
            classTimes: extractedClassTimes
        };
    }

    function sliceCurrentTerm(splitFile) {
        let currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let winter = splitFile.filter(e => e.includes("UNTIL=" + currentYear));
        let fall = splitFile.filter(e => e.includes("UNTIL=" + (currentYear + 1)));
        if (winter.length > 0) {
            setTerm("Winter");
            let winterCourses = [];
            for (let i = 0; i < winter.length; i++) {
                winter[i].split("\n").map(e => winterCourses.push(e));
            }
            return winterCourses;
        } else {
            setTerm("Fall");
            let fallCourses = [];
            for (let i = 0; i < fall.length; i++) {
                fall[i].split("\n").map(e => fallCourses.push(e));
            }
            return fallCourses;
        }
    }

    function dayToNum(s) {
        switch (s) {
            case "MO":
                return 1;
            case "TU":
                return 2;
            case "WE":
                return 3;
            case "TH":
                return 4;
            case "FR":
                return 5;
            default:
                break;
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