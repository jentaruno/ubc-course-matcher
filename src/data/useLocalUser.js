import {useEffect, useState} from 'react';

function useLocalUser(key) {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue
            ? JSON.parse(storedValue)
            : {
                name: 'UBC Student',
                yearLevel: 1,
                degree: '',
                major: '',
                courseList: [],
                classTimes: [],
            };
    });

    useEffect(() => {
        if (value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    const updateValue = (newValue) => {
        setValue((prevValue) => {
            return {...prevValue, ...newValue};
        });
    };

    return [value, updateValue];
}

export default useLocalUser;
