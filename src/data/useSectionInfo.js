import {useEffect, useState} from "react";
import {API_LINK, ENDPOINTS} from "./utilsServer";

export default function useSectionInfo(formData) {
    const [info, setInfo] = useState({});
    const section = formData.subject + "-" + formData.course + "-" + formData.section;
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(API_LINK + ENDPOINTS.sectionInfo + section);
                const json = await response.json();
                setInfo(json);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        }

        if (formData.subject && formData.course && formData.section) {
            fetchData();
        }
    }, [section]);

    return info;
}