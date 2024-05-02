const express = require('express');
const { CalenderNoteController } = require('../controllers');
const { verifyAccessToken } = require('../middlewares/verifyToken');

const router = express.Router();
const calenderNoteController = new CalenderNoteController();

router.get('/', verifyAccessToken, calenderNoteController.getAllNotes);
router.get('/:id', verifyAccessToken, calenderNoteController.getNote);
router.post('/', verifyAccessToken, calenderNoteController.addNote);
router.put('/:id', verifyAccessToken, calenderNoteController.updateNote);
router.delete('/:id', verifyAccessToken, calenderNoteController.deleteNote);

module.exports = router;