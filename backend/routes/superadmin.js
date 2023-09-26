const SuperAdmin = require('../models/superadmin.model')
const AdminCode = require('../models/admincode.model')
const TutorCode = require('../models/tutorcode.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const superAdminUnauthenticatedApisFunction = (app) => {
    app.post('/superadmins/login', async (req, res) => {
        const {email, password} = req.body
        const superAdmin = await SuperAdmin.findOne({email})
        if (superAdmin) {
            const isLoginValid = await bcrypt.compare(password, superAdmin.password)
            if (isLoginValid) {
                const token = jwt.sign({id: superAdmin._id, role: 'superadmin'}, `${process.env.TOKEN_SECRET}`)
                res.status(200).json({token, userID: superAdmin._id, role: 'superadmin'})
            } else {
                res.status(401).json('Incorrect email or password')
            }
        } else {
            res.status(400).json('No super admin with that email exists')
        }
    })

    app.post('/superadmins/register', async (req, res) => {
        const {name, email, password, staffCode, courseCode} = req.body
        const superAdmin = await SuperAdmin.findOne({email})
        if (superAdmin) {
            res.json('Super admin with that email already exists')
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newSuperAdmin = new SuperAdmin({
                name,
                email,
                password: hashedPassword,
                staffCode,
                courseCode
            })
            newSuperAdmin.save()
            .then(() => res.status(200).json('Super admin created successfully'))
            .catch(error => res.status(401).json('Error: ' + error))
        }
    })
}

const superAdminAuthenticatedApisFunction = (app) => {
    app.get('/payments/view', (req, res) => {
        let arrayOfPayments = []
        Student.find()
        .then(student => {
            student.courses.map(element => {
                arrayOfPayments.push(element.amountPaid)
            })
            res.json(arrayOfPayments)
        })
    })

    app.post('/admins/code/generate', async (req, res) => {
        const {email, staffCode} = req.body
        const adminemail = await AdminCode.findOne({email})
        const admincode = await AdminCode.findOne({staffCode})

        if(adminemail || admincode) {
            res.json('Admin with that email or code already exists')
        } else if (!adminemail && !admincode) {
            const newAdminCode = new AdminCode({
                email, staffCode
            })
            newAdminCode.save()
            .then(() => res.status(200).json('Admin generated'))
            .catch(error => res.status(401).json('Error: ' + error))
        }
    })
    app.post('/tutors/code/generate', async (req, res) => {
        const {email, staffCode, courseCode} = req.body
        const tutoremail = await TutorCode.findOne({email})
        const tutorcode = await TutorCode.findOne({staffCode})

        if(tutoremail || tutorcode) {
            res.json('Tutor with that email or code already exists')
        } else if (!tutoremail && !tutorcode) {
            const newTutorCode = new TutorCode({
                email, staffCode, courseCode
            })
            newTutorCode.save()
            .then(() => res.json('Tutor generated'))
            .catch(error => res.status(401).json('Error: ' + error))
        }
    })
}
module.exports = {superAdminAuthenticatedApisFunction, superAdminUnauthenticatedApisFunction}