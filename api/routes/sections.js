const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const {HEADERS, SSC_LINKS} = require('../config');
router.get('/:course', async (req, res) => {
    try {
        // :course format is AANB-500
        const course = req.params.course;
        const queryArray = course.split("-");

        const queryURL = SSC_LINKS.sections.link.concat(
            SSC_LINKS.sections.queries[0],
            queryArray[0],
            SSC_LINKS.sections.queries[1],
            queryArray[1]
        );

        const response = await axios.get(queryURL, HEADERS);
        const $ = cheerio.load(response.data);
        $('.accordion-toggle').remove();
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