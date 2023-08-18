import {useEffect, useState} from 'react';

function useLocalUser(key) {
    const [value, setValue] = useState(() => {
        const storedValue = localStorage.getItem(key);
        return storedValue
            ? JSON.parse(storedValue)
            : null;
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
