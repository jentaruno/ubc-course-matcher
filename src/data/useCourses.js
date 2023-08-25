import {useEffect, useState} from "react";
import {API_LINK, ENDPOINTS} from "./utilsServer";

export default function useCourses(subject) {
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        async function fetchData() {
            setCourses(["Loading..."]);
            try {
                const response = await fetch(API_LINK + ENDPOINTS.courseNumbers + subject);
                const json = await response.json();
                const numbersOnly = json.map(e => e.split(" ")[1]);
                setCourses(numbersOnly);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
                setCourses(["Error"]);
            }
        }

        if (subject) {
            fetchData();
        }
    }, [subject]);

    return courses;
}