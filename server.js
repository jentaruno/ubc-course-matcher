const express = require('express');
const cors = require('cors')
const axios = require("axios");
const app = express();

app.use(cors());

app.get('/api/degrees', async (req, res) => {
    const url = 'https://courses.students.ubc.ca/cs/courseschedule?pname=spec&tname=spec';
    try {
        const {data} = await axios.get(url);
        res.send(data);
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