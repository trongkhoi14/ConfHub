const input = require('../utils/input-handler.js');
const query = require('../utils/queries.js');
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

class settingController {
    getAllSettings = asyncHandler(async (req, res, next) => {
        try {
            const userID = req.user?._id;
            const settings = await query.SettingQuery.selectAllSettings(userID);
            return res.status(status.OK).json({
                data: settings
            });

        } catch (err) {
            next(err);
        }
    });

    changeSetting = asyncHandler(async (req, res, next) => {
        try {
            const setting = input.getSetting(req);
            await query.SettingQuery.updateSetting(setting);
            return res.status(status.OK).json({
                message: "Your change is saved.",
            });
        } catch (err) {
            next(err);
        }
    });

    getSetting = asyncHandler(async (req, res, next) => {
        try {
            const setting = input.getSetting(req);
            const instance = await query.SettingQuery.selectSetting(setting);
            return res.status(status.OK).json({
                instance
            });
        } catch (err) {
            next(err);
        }
    });
}

module.exports = settingController;