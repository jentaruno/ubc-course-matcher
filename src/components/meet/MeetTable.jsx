import React, {useEffect, useState} from "react";
import {Box, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {getAllClassTimes, stringToDate} from "../../data/utilsCourse";

export const MeetTable = ({friends}) => {
    // TODO: placeholder if no user data / friends
    // TODO: y it shaking

    const [loading, setLoading] = useState(true);
    const [friendBlocks, setFriendBlocks] = useState([]);
    const [blocksShades, setBlocksShades] = useState([]);

    const GenerateMeetTable = ({shades}) => {
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
            newMeetTableText.push(<GenerateMeetRow
                time={currentLocaleTime}
                shades={shades}
            />);
        }

        return newMeetTableText;
    }


    const GenerateMeetRow = ({time, shades}) => {
        return <TableRow key={time}>
            <TableCell>
                {(time.substring(3, 5) === "00")
                    ? <TableCell>{time}</TableCell>
                    : <TableCell/>
                }
            </TableCell>
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

    // Takes array of user data and returns array of friend time blocks to add
    const findMeetBlocks = (friends) => {
        return friends.map(e => ({
            name: e.name,
            classTimes: breakBlocks(e.courses)
        }));
    }

    // Breaks class times into 30-minute blocks and returns array of strings e.g. ["MO17:00-18:00"]
    const breakBlocks = (courses) => {
        const classTimes = getAllClassTimes(courses);
        let newClassTimes = [];
        for (let i = 0; i < classTimes.length; i++) {
            let endTime = stringToDate(classTimes[i].end);
            for (let j = stringToDate(classTimes[i].start);
                 j < endTime;
                 j.setMinutes(j.getMinutes() + 30)) {
                let options = {hour: '2-digit', minute: '2-digit', hour12: false};
                let newTime = j.toLocaleTimeString([], options);
                newClassTimes.push("" + classTimes[i].day + newTime);
            }
        }
        newClassTimes = newClassTimes.filter((v, i, a) => a.indexOf(v) === i);

        return newClassTimes;
    }

    // Takes friend blocks and converts them into table shades
    const generateShades = (friendBlocks) => {
        const oneShade = 1 / friendBlocks.length;
        const shades = {};
        // {"MO17:00-18:00": {shade: 0.5, friends: ["A", "B",]}}
        friendBlocks.map(friend => {
            friend.classTimes.map(time => {
                if (shades[time]) {
                    shades[time].shade += oneShade;
                    shades[time].friends.push(friend);
                } else {
                    shades[time] = {shade: oneShade, friends: [friend]};
                }
            })
        });
        return shades;
    }

    useEffect(() => {
        if (loading) {
            const newFriendBlocks = findMeetBlocks(friends);
            const shades = generateShades(newFriendBlocks);
            setBlocksShades(shades);
            setLoading(false);
        }
    }, [friendBlocks]);

    return (
        <Box overflow={'hidden'}>
            <Table className='table table-bordered table-sm' id='meet-table'>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((e) =>
                            <TableCell key={e}>{e}</TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody id="meet">
                    {!loading &&
                        <GenerateMeetTable shades={blocksShades ?? []}/>
                    }
                </TableBody>
            </Table>
        </Box>
    );
}