import {TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React from "react";

export const MeetTableRow = ({time, shades}) => {
    return <TableRow key={time}>
        {(time.substring(3, 5) === "00")
            ? <TableCell>{time}</TableCell>
            : <TableCell><Typography style={{opacity: 0}}>.</Typography></TableCell>
        }
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map(i => {
            const tdId = "" + i + time;
            if (shades[tdId]) {
                const opacity = shades[tdId].shade;
                const friends = "Not free: " + shades[tdId].friends.join(", ");
                return <Tooltip key={`tooltip-${tdId}`} title={friends} arrow>
                    <TableCell
                        style={{backgroundColor: '#DC3545', opacity: opacity}}
                        key={tdId}
                    />
                </Tooltip>;
            } else {
                return <TableCell key={tdId}/>
            }
        })}
    </TableRow>
}