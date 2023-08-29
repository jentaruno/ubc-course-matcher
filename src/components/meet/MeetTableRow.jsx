import {TableCell, TableRow, Tooltip, Typography} from "@mui/material";
import React from "react";

export const MeetTableRow = ({time, shades}) => {
    return <TableRow key={time}>
        {(time.substring(3, 5) === "00")
            ? <TableCell>
                <Typography sx={{fontSize: 'smaller'}}>
                    {time}
                </Typography>
            </TableCell>
            : <TableCell><Typography style={{opacity: 0}}>.</Typography></TableCell>
        }
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map(i => {
            const tdId = "" + i + time;
            if (shades[tdId]) {
                const opacity = shades[tdId].shade;
                const friends = shades[tdId].friends && shades[tdId].friends.length > 0 && "Not free: " + shades[tdId].friends.join(", ");
                const isNowStyles = shades[tdId].now && {border: "3px solid #FCDA58", textAlign: "center"};
                const tableCell = <TableCell
                    style={{backgroundColor: `rgb(71, 122, 45, ${opacity})`, ...isNowStyles}}
                    key={tdId}>
                    <Typography sx={{fontSize: 'smaller'}}>{isNowStyles && "⭐"}</Typography>
                </TableCell>;
                if (opacity > 0) {
                    return <Tooltip key={`tooltip-${tdId}`} title={friends} arrow>
                        {tableCell}
                    </Tooltip>;
                } else {
                    return tableCell;
                }
            } else {
                return <TableCell style={{backgroundColor: '#477a2d'}} key={tdId}/>
            }
        })}
    </TableRow>
}