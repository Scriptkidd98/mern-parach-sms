const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    studentCode: {type: String, required: true, unique: true},
    image: {type: String, required: false},
    gender: {type: String, required: true},
    courses: [{
        courseName: {type: String, required: false},
        courseCode: {type: String, required: false, unique: true},
        coursePrice: {type: Number, required: false},
        startDate: {type: String, required: false},
        endDate: {type: String, required: false},
        amountPaid: {type: Number, required: false},
        balance: {type: Number, required: false},
        dueDate: {type: String, required: false},
        paymentStatus: {type: String, required: false},
        courseDescription: {type: String, required: false},
        installmentDueDurationForCourse: {type: String, required: false},
        cohort: {type: String, required: false},
        completed: {type: Boolean, required: false},
        tutor: {type: String, required: false}
    }],
    receipts: [{
        course: {type: String, required: false},
        file: {type: String, required: false}
    }]
}, {
    timestamps: true
})

const Student = new mongoose.model('Students', studentSchema)

module.exports = Student