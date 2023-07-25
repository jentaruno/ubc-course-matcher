const express = require('express');
const cors = require('cors');
const app = express();

const degreesRouter = require('./routes/degrees');
const subjectsRouter = require('./routes/subjects');
const courseNumbersRouter = require('./routes/courseNumbers');
const sectionsRouter = require('./routes/sections');
const sectionInfoRouter = require('./routes/sectionInfo');

app.use(cors());

const API_LINKS = {
    degrees: {
        link: '/degrees',
        router: degreesRouter
    },
    subjects: {
        link: '/subjects',
        router: subjectsRouter
    },
    courseNumbers: {
        link: '/course-numbers',
        router: courseNumbersRouter
    },
    sections: {
        link: '/sections',
        router: sectionsRouter
    },
    sectionInfo: {
        link: '/section-info',
        router: sectionInfoRouter
    },
}

Object.keys(API_LINKS).forEach(routeName => {
    const {link, router} = API_LINKS[routeName];
    app.use('/api' + link, router);
});
app.use('/login', (req, res) => {
    res.send({
        token: 'test123'
    });
});

app.listen(8080, () => console.log('API is running on http://localhost:8080'));