const express = require('express');
const cors = require('cors');
const app = express();

const degreesRouter = require('./routes/degrees');
const subjectsRouter = require('./routes/subjects');
const courseNumbersRouter = require('./routes/courseNumbers');
const sectionsRouter = require('./routes/sections');
const sectionInfoRouter = require('./routes/sectionInfo');

app.use(cors());

app.use('/api/degrees', degreesRouter);
app.use('/api/subjects', subjectsRouter);
app.use('/api/course-numbers', courseNumbersRouter);
app.use('/api/sections', sectionsRouter);
app.use('/api/section-info', sectionInfoRouter);
app.use('/login', (req, res) => {
    res.send({
        token: 'test123'
    });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));