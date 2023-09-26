const mongoose = require('mongoose')

const enquiriesSchema = mongoose.Schema({
    subject: {type: String, required: false},
    description: {type: String, required: true},
    enquirerName: {type: String, required: true},
    enquirerPhone: {type: Number, required: true}
}, {
    timestamps: true
})

const Enquiry = mongoose.model('Enquiry', enquiriesSchema)

module.exports = Enquiry