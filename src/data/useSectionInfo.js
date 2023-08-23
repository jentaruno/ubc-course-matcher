import {useEffect, useState} from "react";
import {API_LINK, ENDPOINTS} from "./utilsServer";

export default function useSectionInfo(section) {
    const [info, setInfo] = useState({});
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

        if (section) {
            fetchData();
        }
    }, [section]);

    return info;
}