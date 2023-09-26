const mongoose = require('mongoose')

const superAdminSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    image: {type: String, required: false},
    staffCode: {type: String, required: true, unique: true}
}, {
    timestamps: true
})

const SuperAdmin = new mongoose.model('SuperAdmin', superAdminSchema)

module.exports = SuperAdmin