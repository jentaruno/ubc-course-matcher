import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import Header from "./components/navigation/Header";
import YourClasses from "./pages/YourClasses";
import BottomNav from "./components/navigation/BottomNav";
import Profile from "./pages/Profile";
import Friends from "./pages/Friends";
import Match from "./pages/Match";
import Meet from "./pages/Meet";
import {Container} from "@mui/material";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import EditProfile from "./pages/EditProfile";
import useLocalStorage from "./data/useLocalStorage";
import Register from "./pages/Register";
import Satoshi from './fonts/Satoshi-Regular.otf';
import SatoshiBold from './fonts/Satoshi-Bold.otf';

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
    },
    typography: {
        fontFamily: `'Satoshi', Arial, sans-serif`,
        h1: {
            "fontWeight": 600,
        },
        h2: {
            "fontWeight": 600,
        },
        h3: {
            "fontWeight": 600,
        },
        h4: {
            "fontWeight": 600,
        },
        h5: {
            "fontWeight": 600,
        },
        span: {
            "fontWeight": 400
        }
    },
    components: {
        MuiDivider: {
            color: '#AAAAAA',
        },
        MuiCssBaseline: {
            styleOverrides: `
        @font-face {
          font-family: 'Satoshi';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(${Satoshi}) format('otf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
        @font-face {
          font-family: 'Satoshi';
          font-style: normal;
          font-weight: 600;
          src: url(${SatoshiBold}) format('otf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
        },
    },
});

export default function App() {
    const [userData, setUserData] = useLocalStorage("user");

    return (
        <Router>
            <ThemeProvider theme={theme}>
                <Container sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
                    <Header sx={{flexGrow: 0}}/>
                    <Container sx={{p: '1rem', flexGrow: 1, overflowY: 'auto'}} maxWidth={'sm'}>
                        {userData
                            ? <Routes>
                                <Route path="/" element={<Navigate to="/profile" replace/>}/>
                                <Route path="/profile" element={<Profile/>}/>
                                <Route path="/profile/your-classes" element={<YourClasses/>}/>
                                <Route path="/profile/edit" element={<EditProfile/>}/>
                                <Route path="/friends" element={<Friends/>}/>
                                <Route path="/match" element={<Match/>}/>
                                <Route path="/meet" element={<Meet/>}/>
                            </Routes>
                            : <Register setUserData={setUserData}/>}
                    </Container>
                    {userData && <BottomNav sx={{flexGrow: 0}}/>}
                </Container>
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
