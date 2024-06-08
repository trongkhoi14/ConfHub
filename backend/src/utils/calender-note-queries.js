const model = require('../models/index.js');
require('dotenv').config();

const selectAllNotes = async function (userID) {
    try {
        return await model.calenderNoteModel.findAll({ where: { UserId: userID } });
    } catch (error) {
        throw (error);
    }
};

const selectNote = async function (noteID) {
    try {
        return await model.calenderNoteModel.findByPk(noteID);
    } catch (error) {
        throw (error);
    }
};

const insertNote = async function (note, transaction) {
    try {
        // const toCompare = {}
        // if (note.FollowTid) {
        //     toCompare.follow = await model.followModel.findByPk(note.FollowTid);
        // }

        // if (note.ImportantDateDateId && note.OrganizationOrgId) {
        //     throw new Error("Conflicting data.");

        // } else if (note.ImportantDateDateId) {
        //     toCompare.date = await model.importantDateModel.findByPk(note.ImportantDateDateId);
        //     if (toCompare.date) {
        //         if (toCompare.follow && toCompare.follow.CallForPaperCfpId !== toCompare.date.CallForPaperCfpId) {
        //             throw new Error("Conflicting data.");
        //         }
        //         note.date_value = toCompare.date.date_value;
        //     }

        // } else if (note.OrganizationOrgId) {
        //     toCompare.date = await model.organizationModel.findByPk(note.OrganizationOrgId);
        //     if (toCompare.date) {
        //         if (toCompare.follow && toCompare.follow.CallForPaperCfpId !== toCompare.date.CallForPaperCfpId) {
        //             throw new Error("Conflicting data.");
        //         }
        //         note.date_value = [toCompare.date.start_date, toCompare.date.end_date].join(" to ");
        //     }
        // }

        return await model.calenderNoteModel.create({
            UserId: note.UserId,
            note: note.note,
            date_value: note.date_value,
            ImportantDateDateId: note.ImportantDateDateId,
            OrganizationOrgId: note.OrganizationOrgId,
            FollowTid: note.FollowTid,
            transaction: transaction
        });

    } catch (error) {
        throw (error);
    }
};

const updateNote = async function (note, transaction) {
    try {
        const isExisted = await model.calenderNoteModel.findByPk(note.noteID);
        if (!isExisted) {
            throw new Error("Note is not existed");
        }
        return await model.calenderNoteModel.update(
            {
                note: note.note
            },
            { where: { tid: note.noteID } },
            { transaction: transaction }
        );
    } catch (error) {
        throw (error);
    }
};

const deleteNote = async function (note, transaction) {
    try {
        const isExisted = await model.calenderNoteModel.findByPk(note.noteID);
        if (!isExisted) {
            throw new Error("Note is not existed");
        }
        return await model.calenderNoteModel.destroy({ where: { tid: note.noteID } }, { transaction: transaction });
    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectAllNotes,
    insertNote,
    selectNote,
    updateNote,
    deleteNote
};