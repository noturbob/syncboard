const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');

// @route   POST /api/coboards/create
// @desc    Create a new collaborative board
// @access  Private
router.post('/create', auth, async (req, res) => {
  try {
    const newBoard = new Board({
      boardName: 'Untitled Co-board',
      boardData: [], // Starts empty
      owner: req.user.id,
      collaborators: [req.user.id], // The creator is the first collaborator
    });

    const board = await newBoard.save();
    
    // Send back the ID of the newly created board
    res.json({ boardId: board._id });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;  