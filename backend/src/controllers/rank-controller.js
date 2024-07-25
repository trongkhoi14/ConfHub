const model = require('../models');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
const { Sequelize } = require('sequelize');

class RankController {
    getAllRanks = asyncHandler(async (req, res, next) => {
        try {
            const ranks = await model.callForPaperModel.findAll({
                attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('rank')), 'rank']]
            });
            const rankArr = ranks.map(item => item.rank);
            return res.status(status.OK).json({
                message: "Get all field of researches successfully",
                data: rankArr
            });
        } catch (err) {
            next(err);
        }
    });
};

module.exports = RankController;