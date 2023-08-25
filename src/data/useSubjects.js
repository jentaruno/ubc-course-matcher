import {useEffect, useState} from "react";
import {API_LINK, ENDPOINTS} from "./utilsServer";

export default function useSubjects() {
    const [subjects, setSubjects] = useState([]);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(API_LINK + ENDPOINTS.subjects);
                const json = await response.json();
                setSubjects(json);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        }

        fetchData();
    }, []);

    return subjects;
}