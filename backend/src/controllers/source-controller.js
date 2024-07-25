const query = require("../utils/queries.js");
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class SourceController {
    getAllSource = asyncHandler(async (req, res, next) => {
        try {
            const sources = await query.SourceQuery.selectAllSources();
            const sourceArr = sources.map(item => item.src_name);
            return res.status(status.OK).json({
                message: "Get all sources successfully",
                data: sourceArr
            });
        } catch (err) {
            next(err);
        }
    });
}

module.exports = SourceController;