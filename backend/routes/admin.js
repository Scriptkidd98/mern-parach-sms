const Admin = require('../models/admin.model')
const Course = require('../models/courses.model')
const StudentCode = require('../models/studentcode.model')
const AdminCode = require('../models/admincode.model')
const Student = require('../models/students.model')
const Tutor = require('../models/tutor.model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const adminAuthenticatedApisFunction = (app) => {
    app.get('/admins', (req, res) => {
        Admin.find()
        .then(admins => res.json(admins))
        .catch(error => res.status(401).json('Error: ' + error))
    })

    app.get('/tutors', (req, res) => {
        Tutor.find()
        .then(tutors => res.status(200).json(tutors))
        .catch(error => res.status(401).json('Error: ' + error))
    })

    app.get('/students', (req, res) => {
        Student.find()
        .then(students => res.json(students))
        .catch(error => res.status(401).json('Error: ' + error))
    })

    app.post('/students/code/generate', async (req, res) => {
        const {name, email, studentCode, courseObject, courseID} = req.body
        const studentInfo = {name, email, studentCode}
        const date = new Date()
        const studentExists = await StudentCode.findOne({email})
        if (studentExists) {
            return res.json('Student with that email exists')
        } else {
            const newStudentCode = new StudentCode({
                name,
                email, 
                studentCode: studentCode,
                entryCourse: courseObject,
                date
            })
            newStudentCode.save()
            .then(() => {
                Course.findByIdAndUpdate(courseID)
                .then(course => {
                    course.students.push(studentInfo)
                    course.save()
                    .then(() => res.json('Student code generated successfully'))
                    .catch(error => res.status(400).json('Error:' + error))
                })
                .catch(error => res.status(400).json('Error:' + error))
            })
            .catch(error => res.status(400).json('Error:' + error))
        }

    })
    
    app.delete('/student/delete/:id', (req, res) => {
        res.json('Student deleted ' + req.params.id)
    })

    app.patch('/admin/update/:id', (req, res) => {
        Admin.findByIdAndUpdate(req.params.id)
        const {adminUserInfoObject} = req.body
        .then(user => {
            
        })
        .catch(error => res.status(401).json('Error: ' + error))
        res.json('Admin updated ' + req.params.id)
    })

    app.delete('/admin/delete/:id', (req, res) => {
        Admin.findByIdAndDelete(req.params.id)
        .then(() => res.json('Account deleted'))
        .catch(error => res.status(401).json('Error: ' + error))
        res.json('Admin deleted ' + req.params.id)
    })

    app.get('/course/update/:id', (req, res) => {
        const {courseName, courseCode, price, duration, courseDescription} = req.body
        Course.findByIdAndUpdate(req.params.id)
        .then(course => {
            course.courseName = `${courseName}`,
            course.courseCode = `${courseCode}`,
            course.courseDescription = `${courseDescription}`,
            course.duration = `${duration}`,
            course.price = price,
            course.save()
            .then(() => res.json('Course updated successfully'))
            .catch(error => res.status(400).json("Error:" + error))
        })
        .catch(error => res.status(400).json("Error:" + error))
        res.json('Course updated ' + req.params.id)
    })

    app.get('/course/delete/:id', (req, res) => {
        Course.findByIdAndDelete(req.params.id)
        .then(() => res.json('Course deleted successfully'))
        .catch(error => res.status(400).json("Error:" + error))
        res.json('Course deleted ' + req.params.id)
    })

    app.post('/courses/create', (req, res) => {
        const {courseName, courseCode, courseDescription, coursePrice, courseDuration, tutor, multipleCohortsMonthsArray} = req.body
        const newCourse = new Course({
            courseName,
            courseCode,
            coursePrice, 
            courseDuration,
            tutor,
            students: [],
            courseDescription,
            cohorts: multipleCohortsMonthsArray
        })
        newCourse.save()
        .then(() => res.json('Course created successfully'))
        .catch(error => res.status(400).json('Error: ' + error))
    })
}

const adminUnauthenticatedApisFunction = (app) => {
    app.post('/admins/login', async (req, res) => {
        const {email, password} = req.body
        const admin = await Admin.findOne({email})
        if (!admin) {
            return res.status(400).json('Admin with that email does not exist')
        } else {
            const isLoginValid = await bcrypt.compare(password, admin.password)
            if (isLoginValid) {
                const token = jwt.sign({id: admin._id, role: 'admin'}, `${process.env.TOKEN_SECRET}`)
                res.json({token, userId: admin._id, role: 'admin', adminData: admin})
            } else {
                return res.json('Email or password incorrect')
            }
        }
    })

    app.post('/admins/register', async (req, res) => {
        const {name, email, password, staffCode} = req.body
        const isAdminExist = await Admin.findOne({email})
        if (isAdminExist) {
            return res.json('Admin with that email exists')
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newAdmin = new Admin({
                name,
                email,
                password: hashedPassword,
                staffCode
            })
            newAdmin.save()
            .then(() => res.json('Admin created successfully. Now log in'))
            .catch(error => res.status(400).json('Error:' + error))
        }    
    })

    app.post('/admins/onboard', async (req, res) => {
        const {email, staffCode} = req.body

        const adminEmail = await AdminCode.findOne({email})
        const adminStaffCode = await AdminCode.findOne({staffCode})

        if(adminEmail && adminStaffCode) {
            res.status(200).json(adminStaffCode)
        } else if (!adminEmail || !adminStaffCode) {
            res.status(400).json('Admin with that email or code does not exist in the tutor code database')
        }
    })
}

module.exports = {adminAuthenticatedApisFunction, adminUnauthenticatedApisFunction}