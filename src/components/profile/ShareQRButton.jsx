import {Fab} from "@mui/material";
import {QrCode} from "@mui/icons-material";
import React from "react";

export function ShareQRButton() {
    return <Fab sx={{position: "fixed", right: "1rem", bottom: "5rem"}}
                size="large"
                color="secondary"
                aria-label="qr-code">
        <QrCode/>
    </Fab>;
}