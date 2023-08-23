import {useEffect, useState} from "react";
import {API_LINK, ENDPOINTS} from "./utilsServer";

export default function useSections(course) {
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(API_LINK + ENDPOINTS.sections + course);
                const json = await response.json();
                const numbersOnly = json.map(e => e.split(" ")[2]);
                setCourses(numbersOnly);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        }

        if (course) {
            fetchData();
        }
    }, [course]);

    return courses;
}