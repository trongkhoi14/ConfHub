const model = require('../models/index.js');
require('dotenv').config();

// const cfpDates = Promise.all(follows.map(async (follow) => {
//     const importantDates = await model.importantDateModel.findAll({ where: { CallForPaperCfpId: follow.CallForPaperCfpId } });
//     const organizations = await model.organizationModel.findAll({ where: { CallForPaperCfpId: follow.CallForPaperCfpId } });
//     return {
//         importantDates,
//         organizations
//     }
// }));

const selectAllNotes = async function (userID) {
    try {
        return await Promis
        return await Promise.all(follows.map(async (follow) => {
            const notes = await model.calenderNoteModel.findAll({ where: { FollowTid: follow.tid } });
            return notes.map(async (note) => {
                return selectNote(note.tid);
            });
        }));
    } catch (error) {
        throw (error);
    }
};

const selectNote = async function (noteID) {
    try {
        const note = await model.calenderNoteModel.findByPk(noteID);
        if (note.ImportantDateDateId) {
            const date = await model.importantDateModel.findOne({ where: { date_id: note.ImportantDateDateId, status: "new" } });
            // return {
            //     id: note.tid,
            //     note: note.note
            //     date_type:
            //     date_type
            // }
        }
        else if (note.OrganizationOrgId) {
            const date = await model.organizationModel.findByPk(note.OrganizationOrgId);
            return {
                id: note.tid,
                note: note.note,
                date
            }
        } else {
            return {
                id: note.tid,
                note: note.note
            };
        }
    } catch (error) {
        throw (error);
    }
};

const insertNote = async function (followID, note) {
    try {
        const follows = await model.followModel.findAll({ where: { UserId: userID } });
        await model.calenderNoteModel.create({

        })
    } catch (error) {
        throw (error);
    }
};

updateNote = async function (noteID, note) {
    try {

    } catch (error) {
        throw (error);
    }
};

const deleteNote = async function (noteID) {
    try {

    } catch (error) {
        throw (error);
    }
};

module.exports = {

};