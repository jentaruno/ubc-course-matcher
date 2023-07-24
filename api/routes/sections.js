const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

// Import the constants from the config file
const {HEADERS, SSC_LINKS} = require('../config');

router.get('/:section', async (req, res) => {
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

module.exports = router;