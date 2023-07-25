const express = require('express');
const cors = require('cors');
const app = express();

const degreesRouter = require('./routes/degrees');
const sectionsRouter = require('./routes/subjects');
const courseNumbers = require('./routes/courseNumbers');
const sectionInfoRouter = require('./routes/sectionInfo');

app.use(cors());

app.use('/api/degrees', degreesRouter);
app.use('/api/subjects', sectionsRouter);
app.use('/api/course-numbers', courseNumbers);
app.use('/api/sections', sectionInfoRouter);
app.use('/login', (req, res) => {
    res.send({
        token: 'test123'
    });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));