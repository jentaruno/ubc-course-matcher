import {useEffect, useState} from "react";

export default function useSubjects() {
    const [subjects, setSubjects] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await import('./subjects.json');
                setSubjects(data.default);
            } catch (error) {
                console.error('Error fetching JSON data:', error);
            }
        };

        fetchData();
    }, []);

    return subjects;
}