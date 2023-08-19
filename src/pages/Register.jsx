import {Button, Stack} from "@mui/material";
import * as PropTypes from "prop-types";
import {EditProfileForm} from "../components/profile/EditProfileForm";
import React, {useState} from "react";
import useDegrees from "../data/useDegrees";
import {useNavigate} from "react-router-dom";

export default function Register(props) {
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

    function saveUserData() {
        if (Object.keys(formData).every(key => formData[key] !== "")) {
            props.setUserData(formData);
            navigate("/profile/your-classes");
        } else {
            // TODO: toast error
        }
    }

    return (
        <Stack spacing={2}>
            <h2>Let's start with you</h2>
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

Register.propTypes = {
    setUserData: PropTypes.func,
};