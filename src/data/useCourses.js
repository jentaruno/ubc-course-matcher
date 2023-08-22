import {useEffect, useState} from "react";
import {API_LINK, ENDPOINTS} from "./utilsServer";

export default function useCourses(subject) {
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(API_LINK + ENDPOINTS.courseNumbers + subject);
                const json = await response.json();
                console.log(json);
                setCourses(json);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        }

        fetchData();
    }, [subject]);

    return courses;
}