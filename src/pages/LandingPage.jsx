import {Box, Button, Stack, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import Register from "./Register";
import slide1 from '../images/slide1.png';
import slide2 from '../images/slide2.png';
import slide3 from '../images/slide3.png';
import slide4 from '../images/slide4.png';

export default function LandingPage({setUserData}) {
    const [slide, setSlide] = useState(0);
    const imageSlides = [slide1, slide2, slide3, slide4];
    const [registerPage, setRegisterPage] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setSlide((prevIndex) => (prevIndex + 1) % imageSlides.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        !registerPage
            ? <Stack spacing={3} alignItems={"center"}>
                <Box position="relative" width="29vh" height="50vh">
                    {imageSlides.map((e, i) => <img
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'opacity 0.5s ease-out',
                            opacity: slide === i ? 1 : 0,
                        }}
                        width={"200px"}
                        alt={`slide-${i}`}
                        key={`slide-${i}`}
                        src={e}
                    />)}
                </Box>
                <Typography variant={'h4'}>
                    Never be alone in and out of class
                </Typography>
                <Typography>
                    Skip the timetable talk. Quickly see shared classes and schedule meetings with your friends.
                </Typography>
                <Button variant={'outlined'} onClick={() => setRegisterPage(true)}>
                    Get started
                </Button>
            </Stack>
            : <Register setUserData={setUserData}/>
    );
}