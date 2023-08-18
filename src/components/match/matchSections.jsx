import {Divider, Stack} from "@mui/material";
import CourseBlock from "../CourseBlock";
import React, {useEffect, useState} from "react";
import useLocalStorage from "../../data/useLocalStorage";

export default function MatchSections() {
    // TODO: only common sections with you in it vs everything
    const [userData, setUserData] = useLocalStorage("user");
    const [sections, setSections] = useState([]);

    // Takes array of user data and returns array of sections in common
    const findSameSections = (friendsToMatch) => {
        let sameSections = []; //Same sections array. Will have sectionName, sectionFriends
        //vvv Major loop da loop to record same sections and courses
        //Loop for each student
        for (let i = 0; i < friendsToMatch.length; i++) {
            //Loop for each course in this student's timetable
            for (let a = 0; a < friendsToMatch[i].courseList.length; a++) {
                let currentSectionName = friendsToMatch[i].courseList[a];
                let currentSectionFriends = [friendsToMatch[i].name];
                //Loop for next students to check if they have the section
                for (let j = i + 1; j < friendsToMatch.length; j++) {
                    if (friendsToMatch[j].courseList.indexOf(currentSectionName) !== -1)
                        currentSectionFriends.push(friendsToMatch[j].name);
                }
                //If there are common occurences found, add to sameSections
                if (currentSectionFriends.length > 1 && //Check if this is not a duplicate of a previous match record
                    sameSections.map(e => {
                        return (e.course === currentSectionName)
                    }).every(e => e === false))
                    sameSections.push({course: currentSectionName, friends: currentSectionFriends});
            }
        }

        sameSections.sort(function (a, b) {
            return (a.key < b.key) ? -1 : (a.key > b.key) ? 1 : 0;
        });

        console.log("same sections", sameSections);
        return sameSections;
    }

    useEffect(() => {
        const userAndFriends =
            [{
                name: userData.name,
                courseList: userData.courseList,
                classTimes: userData.classTimes
            }
                , ...userData.friends];
        console.log(userAndFriends);
        const matchedSections = findSameSections(userAndFriends);
        setSections(matchedSections);
    }, [userData.classTimes, userData.courseList, userData.name, userData.friends]);

    return (
        <Stack>
            {/*TODO: search feature*/}
            <Stack
                sx={{height: '100%', overflowY: 'scroll'}}
                direction={'column'}
                spacing={1}
                divider={<Divider orientation="horizontal" flexItem/>}
            >
                {sections && sections?.length > 0
                    ? sections.map(({course, friends}) =>
                        <CourseBlock
                            course={course}
                            location={"Earth & Sciences Building"}
                            days={"Mon Wed Fri"}
                            time={"11.00-12.00"}
                            friends={friends ? friends.join(", ") : ""}
                        />
                    )
                    : <p>No matched sections</p>}
            </Stack>
        </Stack>
    );
}