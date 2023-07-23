import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Box, Button, Link, Stack, TextField} from "@mui/material";

async function loginUser(credentials) {
    return fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    })
        .then(data => data.json())
}

export default function Login({setToken}) {
    // TODO: vertical align center
    // TODO: register

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [usernameError, setUsernameError] = useState(false)
    const [passwordError, setPasswordError] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        setUsernameError(false)
        setPasswordError(false)

        if (username === '') {
            setUsernameError(true)
        }
        if (password === '') {
            setPasswordError(true)
        }

        if (username && password) {
            const token = await loginUser({
                username,
                password
            });
            setToken(token);
        }
    }

    return (
        <Box p={4}>
            <form autoComplete="off" onSubmit={handleSubmit}>
                <Box
                    width={'100%'}
                    align={'center'}
                >
                    <Stack
                        spacing={2}
                        p={4}
                        mt={12}
                        width={'20rem'}
                        border={'1px solid gray'}
                        borderRadius={'16px'}
                        justifyItems={'center'}
                        alignItems={'center'}
                    >
                        <h2>Log in</h2>
                        <TextField
                            label="Username"
                            onChange={e => setUsername(e.target.value)}
                            required
                            variant="outlined"
                            type="username"
                            sx={{mb: 3}}
                            fullWidth
                            value={username}
                            error={usernameError}
                        />
                        <TextField
                            label="Password"
                            onChange={e => setPassword(e.target.value)}
                            required
                            variant="outlined"
                            type="password"
                            value={password}
                            error={passwordError}
                            fullWidth
                            sx={{mb: 3}}
                        />
                        <Button variant="contained" type="submit">Login</Button>
                        <small>{`or, `}
                            <Link to="/">
                                register here
                            </Link>
                        </small>
                    </Stack>
                </Box>
            </form>
        </Box>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
};