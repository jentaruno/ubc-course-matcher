import React from "react";
import {MeetTableRow} from "./MeetTableRow";

export const MeetTableBody = ({shades}) => {
    let newMeetTableText = [];
    let startTime = new Date();
    startTime.setHours(8);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    let endTime = new Date();
    endTime.setHours(22);
    endTime.setMinutes(0);
    endTime.setSeconds(0);

    // Loop through the time range
    for (let currentTime = startTime; currentTime <= endTime; currentTime.setMinutes(currentTime.getMinutes() + 30)) {
        let options = {hour: '2-digit', minute: '2-digit', hour12: false};
        let currentLocaleTime = currentTime.toLocaleTimeString([], options);
        newMeetTableText.push(<MeetTableRow
            time={currentLocaleTime}
            shades={shades}
        />);
    }

    return newMeetTableText;
}