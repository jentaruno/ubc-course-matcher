const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const {HEADERS, SSC_LINKS} = require('../config');

router.get('', async (req, res) => {
    try {
        const url = SSC_LINKS.subjects;
        const response = await axios.get(url, HEADERS);
        const $ = cheerio.load(response.data);
        const listDegrees = $('td a');

        const subjectsData = [];
        listDegrees.each((i, e) => {
            subjectsData.push($(e).text());
        });
        res.send(subjectsData);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;