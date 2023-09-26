const Course = require('../models/courses.model')

const generalAuthenticatedApiFunction = (app) => {
    app.get('/courses', (req, res) => {
        Course.find()
        .then(courses => res.json(courses))
        .catch(error => res.status(401).json('Error: ' + error))
    })

    app.get('/course/:id', (req, res) => {
        Course.findOne({courseCode: req.params.id})
        .then(course => res.json(course))
        .catch(error => res.status(401).json('Error: ' + error))
    })
}

module.exports = generalAuthenticatedApiFunction