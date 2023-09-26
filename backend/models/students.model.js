const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    studentCode: {type: String, required: true, unique: true},
    image: {type: String, required: false},
    courses: [{
        courseName: {type: String, required: false},
        courseCode: {type: String, required: false},
        coursePrice: {type: Number, required: false},
        startDate: {type: String, required: false},
        endDate: {type: String, required: false},
        amountPaid: {type: Number, required: false},
        balance: {type: Number, required: false},
        dueDate: {type: String, required: false},
        paymentStatus: {type: String, required: false},
        courseDescription: {type: String, required: false},
        installmentDueDurationForCourse: {type: String, required: false},
        cohort: {type: String, required: true}
    }]
}, {
    timestamps: true
})

const Student = new mongoose.model('Students', studentSchema)

module.exports = Student