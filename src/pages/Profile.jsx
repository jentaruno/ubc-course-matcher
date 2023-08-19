import {Card, CardContent, Grid, Link, Stack} from "@mui/material";
import {ArrowForwardIos, Book, Edit, Logout, QrCode} from "@mui/icons-material";
import useLocalStorage from "../data/useLocalStorage";
import {useState} from "react";
import ShareQRModal from "../components/profile/ShareQRModal";

const Profile = () => {
    const [userData, setUserData] = useLocalStorage("user");
    const [openQRModal, setOpenQRModal] = useState(false);

    return <Stack spacing={3}>
        <Stack
            alignItems={'center'}
            direction={'row'}
            spacing={2}
        >
            {/*<img*/}
            {/*    alt={'user-profile'}*/}
            {/*    className={'rounded-circle'}*/}
            {/*    style={{width: '5rem', height: '5rem'}}*/}
            {/*    src={'https://jentaruno.github.io/profile.jpeg'}*/}
            {/*/>*/}
            <Stack direction={'column'}>
                <h1>{(userData && userData.name) ?? "UBC Student"}</h1>
                <span>{(userData && userData.major) ?? ""}</span>
            </Stack>
        </Stack>
        <Link href={'/profile/your-classes'} underline={'none'}>
            <Card>
                <CardContent>
                    <Grid
                        container
                        spacing={0}
                        alignItems={'center'}
                    >
                        <Grid item xs={2}>
                            <Book fontSize={'large'}/>
                        </Grid>
                        <Grid item xs={9}>
                            <h2>Edit Your Classes</h2>
                            <span>Winter 2023</span>
                        </Grid>
                        <Grid item xs={1}>
                            <ArrowForwardIos/>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Link>

        <Card onClick={() => setOpenQRModal(true)}>
            <CardContent>
                <Grid
                    container
                    spacing={0}
                    alignItems={'center'}
                >
                    <Grid item xs={2}>
                        <QrCode fontSize={'large'}/>
                    </Grid>
                    <Grid item xs={9}>
                        <h2>Share Your Classes</h2>
                        <span>QR Code sharing</span>
                    </Grid>
                    <Grid item xs={1}>
                        <ArrowForwardIos/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>

        <ShareQRModal
            open={openQRModal}
            handleClose={() => setOpenQRModal(false)}
            qrData={{name: userData.name, courses: userData.courses}}
        />

        <Link href={'/profile/edit'} underline={'none'}>
            <p><Edit/> Edit your profile</p>
        </Link>
        <p><Logout/> Log out</p>
    </Stack>;
}

export default Profile;