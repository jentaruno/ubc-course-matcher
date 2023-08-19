import {TableCell, TableRow} from "@mui/material";
import React from "react";

export const MeetTableRow = ({time, shades}) => {
    return <TableRow key={time}>
        {(time.substring(3, 5) === "00")
            ? <TableCell>{time}</TableCell>
            : <TableCell><span style={{opacity: 0}}>.</span></TableCell>
        }
        {["MO", "TU", "WE", "TH", "FR"].map(i => {
            const tdId = "" + i + time;
            const opacity = shades[tdId] ? shades[tdId].shade : 0;
            // TODO: background color = how many ppl
            return <TableCell
                style={{backgroundColor: '#DC3545', opacity: opacity}}
                key={tdId}
            />;
        })}
    </TableRow>
}