import React, {useEffect, useState} from "react";
import {Box, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {getAllClassTimes, stringToDate} from "../../data/utilsCourse";
import {MeetTableBody} from "./MeetTableBody";

export const MeetTable = ({friends, loading, setLoading}) => {
    // TODO: placeholder if no user data / friends
    // TODO: borders
    // TODO: pick which friends to meet with

    const [blocksShades, setBlocksShades] = useState([]);

    // Takes array of user data and returns array of friend time blocks to add
    // {name: "Jen", classTimes: ["12:00","12:30",...]}
    const findMeetBlocks = (friends) => {
        return friends.map(e => ({
            name: e.name,
            classTimes: breakBlocks(e.courses)
        }));
    }

    // Breaks class times into 30-minute blocks and returns array of strings e.g. ["Mon17:00-18:00"]
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
    // {"MO17:00-18:00": {shade: 0.5, friends: ["A", "B",]}}
    const generateShades = (friendBlocks) => {
        const oneShade = 1 / friendBlocks.length;
        const shades = {};
        friendBlocks.map(friend => {
            friend.classTimes.map(time => {
                if (shades[time]) {
                    shades[time].shade += oneShade;
                    shades[time].friends.push(friend.name);
                } else {
                    shades[time] = {shade: oneShade, friends: [friend.name]};
                }
                return time;
            })
            return friend;
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
    }, [friends, loading]);

    return (
        <Box overflow={'hidden'}>
            <Table size="small" sx={{opacity: loading ? '50%' : '100%'}}>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((e) =>
                            <TableCell width={"16%"} key={e}>
                                <b>{e}</b>
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody id="meet">
                    <MeetTableBody shades={blocksShades ?? []}/>
                </TableBody>
            </Table>
            }
        </Box>
    );
}