const { DataTypes } = require('sequelize');
const sequelize = require('./../config/database');
const callForPaperModel = require('./call-for-paper-model');
const { Op } = require('sequelize');

const Feedback = sequelize.define('Feedback', {
    tid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    content: {
        type: DataTypes.TEXT
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    rating: {
        type: DataTypes.DOUBLE
    }
}, {
    timestamps: false,
    tableName: 'feedbacks'
});

const updateRating = async function (cfpID) {
    const numbersOfFeedbacks = await Feedback.findAndCountAll({
        where: { CallForPaperCfpId: cfpID, rating: { [Op.ne]: null } }
    });

    let sum = 0;
    numbersOfFeedbacks.rows.map(fb => {
        sum = sum + fb.rating;
    });

    const cfp = await callForPaperModel.findByPk(cfpID);
    if (cfp) {
        let avgRating = sum / numbersOfFeedbacks.count
        if (avgRating) {
            cfp.rating = avgRating;
            cfp.save();
        }
    }

    return cfp;
};

Feedback.afterCreate(async (feedback, options) => {
    await updateRating(feedback.CallForPaperCfpId);
});

Feedback.afterSave(async (feedback, options) => {
    await updateRating(feedback.CallForPaperCfpId);
});

Feedback.afterUpdate(async (feedback, options) => {
    await updateRating(feedback.CallForPaperCfpId);
});

Feedback.afterDestroy(async (feedback, options) => {
    await updateRating(feedback.CallForPaperCfpId);
});

module.exports = Feedback;