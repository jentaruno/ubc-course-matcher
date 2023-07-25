const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const {HEADERS, SSC_LINKS} = require('../config');
router.get('/:subject', async (req, res) => {
    try {
        // :subject format is AANB
        const subject = req.params.subject;
        const queryURL = SSC_LINKS.courseNumbers.concat(subject);

        const response = await axios.get(queryURL, HEADERS);
        const $ = cheerio.load(response.data);
        const listDegrees = $('.table-striped td a');

        const sectionData = [];

        listDegrees.each((i, e) => {
            sectionData.push($(e).text());
        });

        res.send(sectionData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;