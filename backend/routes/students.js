let Student = require('../models/students.model')
let StudentCode = require('../models/studentcode.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Course = require('../models/courses.model')
require('dotenv').config()

const studentAuthenticatedApisFunction = (app) => {
    app.get('/student/:id', (req, res) => {
        Student.findById(req.params.id)
        .then(student => res.json(student))
        .catch(error => res.status(401).json('Error: ' + error))
    })

    app.patch('/student/update/:id', (req, res) => {
        /* Student.findByIdAndUpdate(req.params.id)
        .then(() => res.json('Account update'))
        .catch(error => res.status(401).json('Error: ' + error)) */
    })

    app.delete('/student/delete/:id', (req, res) => {
        Student.findByIdAndDelete(req.params.id)
        .then(() => res.json('Account deleted'))
        .catch(error => res.status(401).json('Error: ' + error))
    })

    app.post('/course/apply/:id', async (req, res) => {
        const { startDate, courseName, courseCode, courseDescription, courseDuration } = req.body
        const courseObject = {
            startDate, 
            courseName, 
            courseCode, 
            courseDescription,
            courseDuration,
            coursePrice,
            amountPaid,
            paymentStatus,
            dueDate,
            balance,
            installmentDueDurationForCourse
        }
        Student.findByIdAndUpdate(req.params.id)
        .then(student => {
            student.course.push(courseObject)
            student.save()
            .then(() => res.json('Course added successfully'))
            .catch(error => res.status(401).json("Error:" + error))
        })
        .catch(error => res.status(401).json("Error:" + error))
    })
}

const studentUnauthenticatedApisFunction = (app) => {
    app.post('/students/login', async (req, res) => {
        const {email, password} = req.body
        const student = await Student.findOne({email})
        if(!student) {
            return res.status(400).json('Student with that email does not exist')
        } else {
            const isLoginValid = await bcrypt.compare(password, student.password)
            if (isLoginValid) {
                const token = jwt.sign({id: student._id, role: 'student'}, `${process.env.TOKEN_SECRET}`)
                res.status(200).json({token, userId: student._id, role: 'student', studentData: student})
            } else {
                return res.status(401).json('Email or password incorrect')
            }
        }
    })

    app.post('/students/onboard', async (req, res) => {
        const {email, studentCode} = req.body
        const studentEmailExists = await StudentCode.findOne({email}) 
        const studentCodeExists = await StudentCode.findOne({studentCode})
        if (studentCodeExists && studentEmailExists) {
            res.status(200).json(studentEmailExists)

        } else {
            res.status(404).json('Student code not found')
        }
    })

    app.post('/students/register', async (req, res) => {
        const {name, email, password, studentCode, entryCourseObject} = req.body
        const studentExists = await Student.findOne({email})
        if (studentExists) {
            return res.json('Student with that email exists')
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newStudent = new Student({
                name, 
                email, 
                studentCode,
                password: hashedPassword,
                image: " ",
                courses: [entryCourseObject]
            })
            newStudent.save()
            .then(() => res.json('Student created successfully. Now login'))
            .catch(error => res.status(401).json('Error:' + error))
        }
    })
}

module.exports = {studentAuthenticatedApisFunction, studentUnauthenticatedApisFunction}