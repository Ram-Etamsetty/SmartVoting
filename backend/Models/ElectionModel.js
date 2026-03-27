const mongoose = require('mongoose')

const electionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, default: 'election' },
    status: { type: String, enum: ['draft', 'active', 'closed'], default: 'draft' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    allowedVoters: [{
        email: { type: String, required: true }
    }],
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

module.exports = mongoose.model('ElectionModel', electionSchema)