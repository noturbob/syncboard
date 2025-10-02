const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');

// @route   GET /api/boards
// @desc    Get all boards for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/boards/:id
// @desc    Get a single board by its ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    // Check if board exists
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    // Check if the logged-in user is the owner
    if (board.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/boards
// @desc    Save a new board
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { boardName, boardData } = req.body;
    const newBoard = new Board({
      boardName,
      boardData,
      owner: req.user.id,
    });
    const board = await newBoard.save();
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/boards/:id
// @desc    Update an existing board
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { boardName, boardData } = req.body;

    let board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }

    if (board.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    board = await Board.findByIdAndUpdate(
      req.params.id,
      { $set: { boardName, boardData, updatedAt: Date.now() } },
      { new: true }
    );

    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;