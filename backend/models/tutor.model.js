const mongoose = require('mongoose')

const tutorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    courseCode: {type: String, required: true},
    staffCode: {type: String, required: true, unique: true}
}, {
    timestamps: true
})

const Tutor = new mongoose.model('Tutor', tutorSchema)

module.exports = Tutor