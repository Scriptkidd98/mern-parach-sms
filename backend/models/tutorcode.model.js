const mongoose = require('mongoose')

const tutorCodeSchema = new mongoose.Schema({
    email: {type: String, required: true},
    staffCode: {type: String, required: true, unique: true},
    courseCode: {type: String, required: true},
}, {
    timestamps: true
})

const TutorCode = new mongoose.model('TutorCode', tutorCodeSchema)

module.exports = TutorCode