const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    staffCode: {type: String, required: false, unique: true},
    image: {type: String, required: false},
}, {
    timestamps: true
})

const Admin = new mongoose.model('Admins', adminSchema)

module.exports = Admin