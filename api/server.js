const express = require('express');
const cors = require('cors')
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const HEADERS = {
    headers: {
        // 'Pragma': 'no-cache',
        // 'Transfer-Encoding': 'chunked',
        // 'Cache-Control': 'private',
        // 'Content-Type': 'text/html;charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36 Edg/115.0.1901.183',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    }
}
const SSC_LINKS = {
    degrees: 'https://courses.students.ubc.ca/cs/courseschedule?pname=spec&tname=spec',
    subjects: 'https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea',
    sections: {
        link: 'https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section',
        queries: ['&dept=', '&course=', '&section='],
    }
}

app.use(cors());

// TODO: auto write to json

app.get('/api/degrees', async (req, res) => {
    try {
        const response = await axios.get(SSC_LINKS.degrees, HEADERS);
        const $ = cheerio.load(response.data);
        const listDegrees = $('td a');
        const degreesArray = [];

        listDegrees.each((i, e) => {
            degreesArray.push($(e).text());
        });

        res.send(degreesArray);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

app.get('/api/sections/:section', async (req, res) => {
    // TODO: check if section exist
    // TODO: check if no longer offered
    // TODO: handle if datetime, location TBA
    try {
        // :section format will be CPSC-103-101
        const section = req.params.section;
        const queryArray = section.split("-");

        if (queryArray.length !== SSC_LINKS.sections.queries.length) {
            throw new Error('Invalid section.');
        }

        let queryURL = SSC_LINKS.sections.link;
        for (let i = 0; i < SSC_LINKS.sections.queries.length; i++) {
            queryURL += SSC_LINKS.sections.queries[i] + queryArray[i];
        }

        const response = await axios.get(queryURL, HEADERS);
        const $ = cheerio.load(response.data);
        const listDegrees = $('.table-striped td');

        const sectionData = [];

        listDegrees.each((i, e) => {
            sectionData.push($(e).text());
        });

        const sectionInfo = {
            section: section.replaceAll("-", " "),
            days: sectionData[1].trim(" ").split(" "),
            startTime: sectionData[2],
            endTime: sectionData[3],
            location: sectionData[4]
        }

        res.send(sectionInfo);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

// TODO: load subjects for autofill
// app.get('/api/subjects', async (req, res) => {
//     try {
//         const response = await axios.get(SSC_LINKS.sections, HEADERS);
//         console.log(response.data);
//         const $ = cheerio.load(response.data);
//         const listSubjects = $('td a');
//         const subjectsArray = [];
//
//         listSubjects.each((i, e) => {
//             subjectsArray.push($(e).text());
//         });
//
//         res.send(subjectsArray);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).send('Error fetching data');
//     }
// });

app.use('/login', (req, res) => {
    res.send({
        token: 'test123'
    });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));