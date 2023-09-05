import {Button, Stack, Typography} from "@mui/material";
import {EditProfileForm} from "../components/profile/EditProfileForm";
import React, {useState} from "react";
import useDegrees from "../data/useDegrees";
import {useNavigate} from "react-router-dom";

export default function Register({setUserData}) {
    const [formData, setFormData] = useState({
        name: 'UBC Student',
        yearLevel: 1,
        degree: "",
        major: "",
        courses: [],
        friends: [],
    });
    const degrees = useDegrees();
    const navigate = useNavigate();

    function handleChange(event) {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    }

    async function saveUserData() {
        if (Object.keys(formData).every(key => formData[key] !== "")) {
            await setUserData(formData);
            navigate("/profile/your-classes");
        } else {
            // TODO: toast error
        }
    }

    return (
        <Stack spacing={2}>
            <Typography variant={'h5'}>Let's start with you</Typography>
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
                Next
            </Button>
        </Stack>
    )
}