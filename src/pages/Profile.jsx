import {Card, CardContent, Grid, Link, Stack, Typography} from "@mui/material";
import {ArrowForwardIos, Book, Edit, QrCode} from "@mui/icons-material";
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
                <Typography variant={'h4'}>{(userData && userData.name) ?? "UBC Student"}</Typography>
                <Typography>{(userData && userData.major) ?? ""}</Typography>
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
                            <Typography variant={'h5'}>Edit Your Classes</Typography>
                            <Typography>Winter 2023</Typography>
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
                        <Typography variant={'h5'}>Share Your Classes</Typography>
                        <Typography>QR Code sharing</Typography>
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
            <Stack direction={'row'} spacing={1}>
                <Edit/>
                <Typography>Edit your profile</Typography>
            </Stack>
        </Link>
        {/*<Typography><Logout/> Log out</Typography>*/}
    </Stack>;
}

export default Profile;