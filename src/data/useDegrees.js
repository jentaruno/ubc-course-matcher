import {useEffect, useState} from "react";

export default function useDegrees() {
    const [degrees, setDegrees] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await import('./degrees.json');
                setDegrees(data.default);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        };

        fetchData();
    }, []);

    return degrees;
}