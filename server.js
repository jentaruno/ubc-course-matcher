const express = require('express');
const cors = require('cors')
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const SSC_LINKS = {
    degrees: 'https://courses.students.ubc.ca/cs/courseschedule?pname=spec&tname=spec',
}

app.use(cors());

// TODO: make inaccessible for public
// TODO: auto write to json

app.get('/api/degrees', async (req, res) => {
    try {
        const response = await axios.get(SSC_LINKS.degrees);
        const $ = cheerio.load(response.data);
        const listDegrees = $("td a");
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

app.use('/login', (req, res) => {
    res.send({
        token: 'test123'
    });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));