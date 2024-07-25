const query = require("../utils/queries.js");
const input = require('../utils/input-handler.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class calenderNoteController {
    getAllNotes = asyncHandler(async (req, res, next) => {
        try {
            const userID = req.user?._id;
            const notes = await query.NoteQuery.selectAllNotes(userID);
            return res.status(status.OK).json({
                message: "Get all notes successfully",
                length: notes.length,
                data: notes
            });
        } catch (err) {
            next(err);
        }
    });

    getNote = asyncHandler(async (req, res, next) => {
        try {
            const noteID = req.params?.id;
            const note = await query.NoteQuery.selectNote(noteID);
            return res.status(status.OK).json({
                message: note ? `Get note ${noteID} successfully` : "There is something wrong!",
                data: note
            });
        } catch (err) {
            next(err);
        }
    });

    addNote = asyncHandler(async (req, res, next) => {
        try {
            const note = input.getNote(req);
            const newNote = await query.NoteQuery.insertNote(note);
            return res.status(status.OK).json({
                message: "Insert successfully",
                new_note: newNote
            });
        } catch (err) {
            next(err);
        }
    });

    updateNote = asyncHandler(async (req, res, next) => {
        try {
            const note = input.getNote(req);
            await query.NoteQuery.updateNote(note);
            return res.status(status.OK).json({
                message: "Update successfully",
            });
        } catch (err) {
            next(err);
        }
    });

    deleteNote = asyncHandler(async (req, res, next) => {
        try {
            const note = input.getNote(req);
            await query.NoteQuery.deleteNote(note)
            return res.status(status.OK).json({
                message: "Delete successfully",
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = calenderNoteController;