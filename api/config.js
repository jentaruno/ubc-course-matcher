const HEADERS = {
    headers: {
        // Your header configurations here
    }
};

const SSC_LINKS = {
    degrees: 'https://courses.students.ubc.ca/cs/courseschedule?pname=spec&tname=spec',
    subjects: 'https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea',
    courseNumbers: 'https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-department&dept=',
    sections: {
        link: 'https://courses.students.ubc.ca/cs/courseschedule?pname=subjarea&tname=subj-section',
        queries: ['&dept=', '&course=', '&section='],
    }
};

module.exports = {HEADERS, SSC_LINKS};
