const express = require('express')
const { createElection, deleteElection, getElections } = require('../Controllers/electionController')
const { protect } = require('../Middleware/AuthMiddleWare')
const router = express.Router()

router.post('/', protect, createElection)
router.get('/', protect, getElections)
router.delete('/:id', protect, deleteElection)

module.exports = router