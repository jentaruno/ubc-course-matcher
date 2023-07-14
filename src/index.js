import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import './custom.scss';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Header from "./components/Header";
import CourseMatcher from "./pages/CourseMatcher";
import YourClasses from "./pages/YourClasses";
import BottomNav from "./components/BottomNav";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Match from "./pages/Match";
import Meet from "./pages/Meet";
import {Box} from "@mui/material";
import {createTheme, ThemeProvider} from '@mui/material/styles';

export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#002145',
        },
        secondary: {
            main: '#D29A15',
        },
        divider: '#E2E3E5',
    },
});

export default function App() {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Box style={{display: 'flex', height: '100vh', overflowY: 'scroll', flexDirection: 'column'}}>
                    <Header/>
                    <Box sx={{p: '1rem', flexGrow: 1}}>
                        <Routes>
                            <Route path="/" element={<CourseMatcher/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                            <Route path="/friends" element={<Friends/>}/>
                            <Route path="/match" element={<Match/>}/>
                            <Route path="/meet" element={<Meet/>}/>
                            <Route path="/your-classes" element={<YourClasses/>}/>
                        </Routes>
                    </Box>
                    <BottomNav/>
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
