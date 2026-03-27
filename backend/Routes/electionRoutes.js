const express = require('express')
const { createElection, deleteElection, getElections, getElectionById, getVoterElections, getVoterElectionById, castVote, activateElection, editElection, getElectionBallots } = require('../Controllers/electionController')
const { protect } = require('../Middleware/AuthMiddleWare')
const router = express.Router()

router.post('/', protect, createElection)
router.get('/', protect, getElections)
router.get('/voter', protect, getVoterElections)
router.get('/voter/:id', protect, getVoterElectionById)
router.get('/:id', protect, getElectionById)
router.get('/:id/ballots', protect, getElectionBallots)
router.post('/:id/vote', protect, castVote)
router.put('/:id/activate', protect, activateElection)
router.put('/:id', protect, editElection)
router.delete('/:id', protect, deleteElection)

module.exports = router