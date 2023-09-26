const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');
const cors = require('cors')

const corsOptions = {
    origin: "http://localhost:3000"
}

const app = express()

app.use(express.json())

app.use(cors())

mongoose.connect(process.env.ATLAS_URI)

const {studentAuthenticatedApisFunction, studentUnauthenticatedApisFunction} = require('./routes/students')
const {adminAuthenticatedApisFunction, adminUnauthenticatedApisFunction} = require('./routes/admin')
const {superAdminAuthenticatedApisFunction, superAdminUnauthenticatedApisFunction} = require('./routes/superadmin')
const generalAuthenticatedApiFunction = require('./routes/general')
const {tutorAuthenticatedApiFunction, tutorUnauthenticatedApiFunction} = require('./routes/tutors')

studentUnauthenticatedApisFunction(app)
adminUnauthenticatedApisFunction(app)
superAdminUnauthenticatedApisFunction(app)
tutorUnauthenticatedApiFunction(app)

app.use((req, res, next) => {
    //console.log(req.method, req.path)
    const token = req.headers.authorization
    //console.log(token)
    if (token) {
        jwt.verify(token, `${process.env.TOKEN_SECRET}`, (err, decoded) => {
            if (err) {
                //console.log("Decoded ", decoded)
                return res.status(403).json('Unauthorized to access this data');
            }
            //console.log("Decoded ", decoded)
            req.user = decoded;
            if (req.user.role === 'student') {
                studentAuthenticatedApisFunction(app)
                generalAuthenticatedApiFunction(app)
            } else if (req.user.role === 'admin') {
                adminAuthenticatedApisFunction(app)
                generalAuthenticatedApiFunction(app)
            } else if (req.user.role === 'superadmin') {
                adminAuthenticatedApisFunction(app)
                superAdminAuthenticatedApisFunction(app)
                generalAuthenticatedApiFunction(app)
            } else if (req.user.role === 'tutor') {
                tutorAuthenticatedApiFunction(app)
                generalAuthenticatedApiFunction(app)
            } else {
                return res.status(403).json('Unauthorized to access this data');
            }
            next();
        });
    } else {
        return res.status(401).json('No token provided');
    }
})

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB connection successful');
})

app.listen(process.env.PORT, () => {
    console.log('Listening on port', process.env.PORT)
})