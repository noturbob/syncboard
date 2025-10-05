const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Board = require('../models/Board');

// GET all boards for a user
router.get('/', auth, async (req, res) => {
  try {
    const boards = await Board.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a single board by its ID
router.get('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    if (board.owner.toString() !== req.user.id && !board.collaborators.includes(req.user.id)) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST a new board
router.post('/', auth, async (req, res) => {
  try {
    const { boardName, boardData } = req.body;
    const newBoard = new Board({ boardName, boardData, owner: req.user.id });
    const board = await newBoard.save();
    res.json(board);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT (update) an existing board
router.put('/:id', auth, async (req, res) => {
  try {
    const { boardName, boardData } = req.body;
    let board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ msg: 'Board not found' });
    if (board.owner.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    
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

// DELETE a board
router.delete('/:id', auth, async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ msg: 'Board not found' });
    }
    if (board.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Board.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Board removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;