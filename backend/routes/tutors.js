const TutorCode = require('../models/tutorcode.model')
const Tutor = require('../models/tutor.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const tutorAuthenticatedApiFunction = (app) => {
    app.post('/admins')
    app.get('/tutors')
}

const tutorUnauthenticatedApiFunction = (app) => {
    app.post('/tutors/register', async (req, res) => {
        const {name, email, password, staffCode, courseCode} = req.body
        const tutorEmailExists = await Tutor.findOne({email})
        const tutorStaffExists = await Tutor.findOne({staffCode})

        if(tutorEmailExists && tutorStaffExists) {
            res.json('Tutor with that email already exists')
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newTutor = new Tutor({
                name,
                email,
                password: hashedPassword,
                staffCode,
                courseCode
            })
            newTutor.save()
            .then(() => res.status(200).json('Tutor created successfully. Now login'))
            .catch(error => res.status(401).json('Error: ' + error))
        }
    })
    app.post('/tutors/login', async (req, res) => {
        const{email, password} = req.body

        const tutor = await Tutor.findOne({email})

        if (tutor) {
            const isLoginValid = await bcrypt.compare(password, tutor.password)
            if (isLoginValid) {
                const token = jwt.sign({id: tutor._id, role: 'tutor'}, `${process.env.TOKEN_SECRET}`)
                res.status(200).json({token, userId: tutor._id, role: 'tutor'})
            } else {
                return res.status(401).json('Email or password incorrect')
            }
        } else {
            return res.status(400).json('Tutor with that email does not exist')
        }
    })

    app.post('/tutors/onboard', async (req, res) => {
        const{email, staffCode} = req.body
        const tutorEmailExists = await TutorCode.findOne({email})
        const tutorStaffCodeExists = await TutorCode.findOne({staffCode})

        if(tutorEmailExists && tutorStaffCodeExists) {
            res.status(200).json(tutorStaffCodeExists)
        } else if (!tutoremail || !tutorcode) {
            res.status(400).json('Tutor with that email or code does not exist in the tutor code database')
        }
    })
}

module.exports = {tutorAuthenticatedApiFunction, tutorUnauthenticatedApiFunction}