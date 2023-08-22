import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './custom.scss';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/navigation/Header";
import CourseMatcher from "./pages/CourseMatcher";
import YourClasses from "./pages/YourClasses";
import BottomNav from "./components/navigation/BottomNav";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Match from "./pages/Match";
import Meet from "./pages/Meet";
import {Box, Container} from "@mui/material";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import EditProfile from "./pages/EditProfile";
import useLocalStorage from "./data/useLocalStorage";
import Register from "./pages/Register";

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#002145',
            light: '#6B778A'
        },
        secondary: {
            main: '#D29A15',
        },
        divider: '#AAAAAA',
    },
});

export default function App() {
    const [userData, setUserData] = useLocalStorage("user");

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Box style={{display: 'flex', height: '100vh', overflowY: 'scroll', flexDirection: 'column'}}>
                    <Header/>
                    <Container sx={{p: '1rem', flexGrow: 1}} maxWidth={'sm'}>
                        {userData
                            ? <Routes>
                                <Route path="/" element={<CourseMatcher/>}/>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/profile/your-classes" element={<YourClasses/>}/>
                                <Route path="/profile/edit" element={<EditProfile/>}/>
                                <Route path="/friends" element={<Friends/>}/>
                                <Route path="/match" element={<Match/>}/>
                                <Route path="/meet" element={<Meet/>}/>
                            </Routes>
                            : <Register setUserData={setUserData}/>}
                    </Container>
                    {userData && <BottomNav/>}
                </Box>
            </ThemeProvider>
        </Router>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
