const mongoose = require('mongoose')

const studentCodeSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    studentCode: {type: String, required: true, unique: true},
    entryCourse: {
        amountPaid : {type: Number, required: true}, 
        paymentStatus : {type: String, required: true},
        coursePrice: {type: Number, required: true},
        startDate: {type: String, required: true},
        courseName: {type: String, required: true}, 
        courseCode: {type: String, required: true}, 
        courseDescription: {type: String, required: true},
        courseDuration: {type: String, required: true},
        dueDate: {type: String, required: true},
        installmentDueDurationForCourse: {type: String, required: true},
        balance: {type: Number, required: true},
        cohort: {type: String, required: true}
    },
    date: {type: String, required: true}
}, {
    timestamps: true
})

const StudentCode = new mongoose.model('StudentsCode', studentCodeSchema)

module.exports = StudentCode