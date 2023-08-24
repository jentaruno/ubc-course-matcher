import {Button, Link, Stack} from "@mui/material";
import React, {useState} from "react";
import {ArrowBack} from "@mui/icons-material";
import useDegrees from "../data/useDegrees";
import useLocalStorage from "../data/useLocalStorage";
import {EditProfileForm} from "../components/profile/EditProfileForm";
import AlertToast from "../components/reusable/AlertToast";

export default function EditProfile() {
    // TODO: default profpic
    // TODO: implem ID

    const [userData, setUserData] = useLocalStorage("user");
    const [formData, setFormData] = useState(userData);
    const [openToastError, setOpenToastError] = useState(false);
    const [openToastSuccess, setOpenToastSuccess] = useState(false);
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
            setOpenToastSuccess(true);
            setUserData(formData);
        } else {
            setOpenToastError(true);
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
            <AlertToast
                open={openToastError}
                setOpen={setOpenToastError}
                variant={"error"}
                message={"Please fill in all fields."}
            />
            <AlertToast
                open={openToastSuccess}
                setOpen={setOpenToastSuccess}
                variant={"success"}
                message={"Profile saved successfully!"}
            />
        </Stack>
    );
}