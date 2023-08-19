import {Button, Link, Stack} from "@mui/material";
import React, {useState} from "react";
import {ArrowBack} from "@mui/icons-material";
import useDegrees from "../data/useDegrees";
import useLocalStorage from "../data/useLocalStorage";
import {EditProfileForm} from "../components/profile/EditProfileForm";

export default function EditProfile() {
    // TODO: default profpic
    // TODO: implem ID

    const [userData, setUserData] = useLocalStorage("user");
    const [formData, setFormData] = useState(userData);
    const degrees = useDegrees();

    function handleChange(event) {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    function saveUserData() {
        if (Object.keys(formData).every(key => formData[key] !== "")) {
            setUserData(formData);
        } else {
            // TODO: toast error
        }
    }

    return (
        <Stack spacing={1} component={'form'}>
            <h1>
                <Link
                    href={'/profile'}
                    underline={'none'}
                >
                    <ArrowBack/>
                </Link>
                {' Edit Profile'}
            </h1>

            {/*<InputLabel id={'photo'}>*/}
            {/*</InputLabel>*/}

            <EditProfileForm
                formData={formData}
                onChange={handleChange}
                degrees={degrees}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={saveUserData}
            >
                Save
            </Button>
        </Stack>
    );
}