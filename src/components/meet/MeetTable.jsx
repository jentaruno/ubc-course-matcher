import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import {getAllClassTimes} from "../../data/utilsCourse";

export const MeetTable = ({friends}) => {
    // TODO: placeholder if no user data / friends
    // TODO: y it shaking

    const [loading, setLoading] = useState(true);
    const [tableText, setTableText] = useState("");
    const [tooltips, setTooltips] = useState("");

    const displayMeetBlocks = (courses) => {
        let friendsList = friends.map(e => e.name);
        //this.generateTooltips();

        //Display tooltips for who's not free
        // for (let i = 0; i < courses.length; i++) {
        //     courses[i].classTimes.map(e => {
        //         addTooltip(e.tdId, friendsList, courses[i].key);
        //     })
        // }
        generateMeetTable();

        //Add shades to table
        removeShades();
        for (let i = 0; i < courses.length; i++) {
            courses[i].classTimes.map(e => {
                addShade(e.tdId);
            });
        }
        placeNowPointer();
    }

    const findMeetBlocks = () => {
        let blocksToAdd = friends.map(e => {
            return {
                key: e.name,
                classTimes: breakBlocks(e.courses)
            }
        })

        return blocksToAdd;
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

    const stringToDate = (time) => {
        var date = new Date();
        var parts = time.split(':');
        date.setHours(parts[0]);
        date.setMinutes(parts[1]);
        return date;
    }

    const addTooltip = (tooltipId, friendsList, name) => {
        let newTooltips = tooltips;
        let free = [];
        let notFree = [];
        newTooltips[tooltipId].notFree.push(name);
        if (newTooltips[tooltipId].text == "Everyone's free!") {
            free = friendsList.filter(e => e != name);
            notFree = [name];
            newTooltips[tooltipId].text = ("Free: " + free + ". Not free: " + notFree).replaceAll(",", ", ");
        } else if (newTooltips[tooltipId].free.length == 0) {
            return;
        } else {
            let rawFree = newTooltips[tooltipId].free.filter(e => e != name);
            let rawNotFree = newTooltips[tooltipId].notFree;
            rawNotFree.push(name);
            free = new Set(rawFree);
            free = [...free];
            notFree = new Set(rawNotFree);
            notFree = [...notFree];
            newTooltips[tooltipId].text = ("Free: " + free + ". Not free: " + notFree).replaceAll(",", ", ");

            if (free.length == 0) {
                newTooltips[tooltipId].text = "No one's free";
            }
        }

        newTooltips[tooltipId].free = free;
        newTooltips[tooltipId].notFree = notFree;

        setTooltips(newTooltips);
    }

    const removeShades = () => {
        var table = document.getElementById("meet-table");
        var tableCells = table.getElementsByTagName("td");
        for (var i = 0; i < tableCells.length; i++) {
            tableCells[i].style.opacity = "0";
        }
    }

    const addShade = (tdId) => {
        let cell = document.getElementById(tdId);
        let unit = 1 / friends.length;
        if (cell.style.opacity == 0) {
            cell.style.opacity = unit;
        } else if (cell.style.opacity < 1) {
            cell.style.opacity = +cell.style.opacity + unit;
        }
    }

    const placeNowPointer = () => {
        var d = new Date();
        var minutes = d.getMinutes();
        var roundDownMinutes = 0;
        if (minutes < 30) {
            roundDownMinutes = 0;
        } else {
            roundDownMinutes = 30;
        }
        d.setMinutes(roundDownMinutes);
        d.setSeconds(0);
        let options = {hour: '2-digit', minute: '2-digit', hour12: false};
        let currentLocaleTime = d.toLocaleTimeString([], options);
        let timeNow = "" + d.getDay() + currentLocaleTime;
        if (document.getElementById(timeNow))
            document.getElementById(timeNow).style.border = "2px solid yellow";
    }


    const generateTooltips = () => {
        let newTooltips = {};
        const startTime = new Date();
        const endTime = new Date();
        endTime.setHours(22);
        endTime.setMinutes(0);
        endTime.setSeconds(0);
        let options = {hour: '2-digit', minute: '2-digit', hour12: false};

        // Loop through the time range
        ["MO", "TU", "WE", "TH", "FR"].map(i => {
            startTime.setHours(8);
            startTime.setMinutes(0);
            startTime.setSeconds(0);
            for (let currentTime = startTime;
                 currentTime <= endTime;
                 currentTime.setMinutes(currentTime.getMinutes() + 30)) {
                let currentLocaleTime = currentTime.toLocaleTimeString([], options);
                newTooltips["" + i + currentLocaleTime] = {text: "Everyone's free!", free: [], notFree: []};
            }
        })

        setTooltips(newTooltips);
    }

    const generateMeetTable = () => {
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
            if (currentTime.getMinutes() == 0) {
                newMeetTableText.push(<tr className='d-flex'>
                    <th className='col-2 p-1' scope='row'>{currentLocaleTime}</th>
                    {generateMeetRow(currentLocaleTime)}
                </tr>);
            } else {
                newMeetTableText.push(<tr className='d-flex'>
                    <th className='col-2 p-1' scope='row'><span className='d-flex'></span></th>
                    {generateMeetRow(currentLocaleTime)}
                </tr>);
            }
        }

        setTableText(newMeetTableText);
    }

    const generateMeetRow = (currentRow) => {
        let meetRows = [];
        ["MO", "TU", "WE", "TH", "FR"].map(i => {
            const tdId = "" + i + currentRow;
            let tooltipText = "";
            if (tooltips[tdId] && tooltips[tdId].text != null) {
                tooltipText = tooltips[tdId].text;
            }
            const tooltip = (<Tooltip>
                {tooltipText}
            </Tooltip>)
            meetRows.push(<td id={tdId} className='col p-0 bg-danger' style={{opacity: 0}}><OverlayTrigger
                placement="bottom"
                overlay={tooltip}>
                <span className='d-flex' style={{opacity: 0}}>.</span>
            </OverlayTrigger></td>);
        })
        return meetRows;
    }

    useEffect(() => {
        if (loading) {
            generateMeetTable();
            generateTooltips();
            displayMeetBlocks(findMeetBlocks());
            setLoading(false);
        }
    }, [tableText]);

    return (
        <Box overflow={'hidden'}>
            <table className='table table-bordered table-sm' id='meet-table'>
                <thead>
                <tr className='d-flex'>
                    <th className='col-2'></th>
                    <th scope='col' className='col'>Mon</th>
                    <th scope='col' className='col'>Tue</th>
                    <th scope='col' className='col'>Wed</th>
                    <th scope='col' className='col'>Thu</th>
                    <th scope='col' className='col'>Fri</th>
                </tr>
                </thead>
                <tbody id="meet">{tableText}</tbody>
            </table>
        </Box>
    );
}