import {Stack} from "@mui/material";
import React, {useEffect, useState} from "react";
import useLocalStorage from "../../data/useLocalStorage";
import LoadedCourses from "../profile/LoadedCourses";

export default function MatchSections() {
    // TODO: only common sections with you in it vs everything
    const [userData, setUserData] = useLocalStorage("user");
    const [sections, setSections] = useState([]);

    // Takes array of user data and returns sections in common (array of strings)
    const findSameSections = (friendsToMatch) => {
        let sameSections = []; //Same sections array. Will have sectionName, sectionFriends
        //vvv Major loop da loop to record same sections and courses
        //Loop for each student
        for (let i = 0; i < friendsToMatch.length; i++) {
            //Loop for each course in this student's timetable
            for (let a = 0; a < friendsToMatch[i].courses.length; a++) {
                let currentSection = friendsToMatch[i].courses[a];
                let currentSectionFriends = [friendsToMatch[i].name];
                //Loop for next students to check if they have the section
                for (let j = i + 1; j < friendsToMatch.length; j++) {
                    if (friendsToMatch[j].courses.map(e => e.name).indexOf(currentSection.name) !== -1)
                        currentSectionFriends.push(friendsToMatch[j].name);
                }
                //If there are common occurences found, add to sameSections
                if (currentSectionFriends.length > 1 && //Check if this is not a duplicate of a previous match record
                    sameSections.map(e => e.name === currentSection.name)
                        .every(e => e === false))
                    sameSections.push({
                        name: currentSection.name,
                        location: currentSection.location,
                        classTimes: currentSection.classTimes,
                        friends: currentSectionFriends
                    });
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
                courses: userData.courses,
                classTimes: userData.classTimes
            }
                , ...userData.friends];
        console.log(userAndFriends);
        const matchedSections = findSameSections(userAndFriends);
        setSections(matchedSections);
    }, [userData.classTimes, userData.courses, userData.name, userData.friends]);

    return (
        <Stack>
            {/*TODO: search feature*/}
            <LoadedCourses courses={sections}/>
        </Stack>
    );
}