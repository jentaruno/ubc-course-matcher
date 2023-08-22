import {useEffect, useState} from "react";
import {API_LINK, ENDPOINTS} from "./utilsServer";

export default function useDegrees() {
    const [degrees, setDegrees] = useState([]);
    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const data = await import('./degrees.json');
        //         setDegrees(data.default);
        //     } catch (error) {
        //         console.error('Error fetching JSON data:', error);
        //     }
        // };

        async function fetchData() {
            try {
                const response = await fetch(API_LINK + ENDPOINTS.degrees);
                const json = await response.json();
                setDegrees(json);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        }

        fetchData();
    }, []);

    return degrees;
}