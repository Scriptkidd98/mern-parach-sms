const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
    courseName: {type: String, required: true},
    courseCode: {type: String, required: true},
    coursePrice: {type: Number, required: true},
    students: [{
        name: {type: String, required: false},
        email: {type: String, required: false},
        studentCode: {type: String, required: false}
    }],
    installmentDueDuration: {type: String, required: false},
    courseDescription: {type: String, required: true},
    courseDuration: {type: String, required: true},
    cohorts: [{type: String, required: true}],
    tutor: {type: String, required: true}
}, {
    timestamps: true
})

const Course = new mongoose.model('Courses', courseSchema)

module.exports = Course