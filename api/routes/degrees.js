const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const router = express.Router();

const {HEADERS, SSC_LINKS} = require('../config');

router.get('/', async (req, res) => {
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

module.exports = router;