const mongoose = require('mongoose')

const adminCodeSchema = new mongoose.Schema({
    email: {type: String, required: true},
    staffCode: {type: String, required: true}
}, {
    timestamps: true
})

const AdminCode = new mongoose.model('Admin', adminCodeSchema)

module.exports = AdminCode