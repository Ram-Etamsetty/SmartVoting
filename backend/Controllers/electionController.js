const electionModel = require('../Models/ElectionModel')


const createElection = async (req, res) => {
    const { title, description, type, status, startDate, endDate, allowedVoters } = req.body
    try {
        if (!title || !startDate || !endDate) {
            return res.status(400).json({ message: "Title,StartDate and EndDate are required" })
        }
        const election = await electionModel.create({
            title,
            description,
            type: type || 'election',
            status: status || 'draft',
            startDate,
            endDate,
            allowedVoters: allowedVoters || [],
            adminId: req.user.id
        })
        res.status(201).json(election)
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

const getElections = async (req, res) => {
    try {
        const elections = await electionModel.find({ adminId: req.user.id }).sort({ createdAt: -1 })
        res.status(200).json(elections)
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}

const deleteElection = async (req, res) => {
    try {
        const election = await electionModel.findOneAndDelete({ _id: req.params.id, adminId: req.user.id })
        if (!election) return res.status(404).json({ message: 'Election Not Found' })
        res.status(200).json({ message: 'Election Deleted' })
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message })
    }
}



module.exports = { createElection, deleteElection, getElections }