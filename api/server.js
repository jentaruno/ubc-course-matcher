const express = require('express');
const cors = require('cors');
const app = express();

const degreesRouter = require('./routes/degrees');
const sectionsRouter = require('./routes/sections');

app.use(cors());

app.use('/api/degrees', degreesRouter);
app.use('/api/sections', sectionsRouter);
app.use('/login', (req, res) => {
    res.send({
        token: 'test123'
    });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));