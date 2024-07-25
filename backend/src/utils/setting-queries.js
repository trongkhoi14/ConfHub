const model = require('../models/index.js');
require('dotenv').config();

const selectAllSettings = async function (userID) {
    try {
        return await model.settingModel.findAll({ where: { UserId: userID } });
    } catch (error) {
        throw (error);
    }
};

const updateSetting = async function (setting) {
    try {
        await model.settingModel.update(
            {
                value: setting.value,
                status: setting.status
            },
            {
                where: {
                    UserId: setting.userID,
                    name: setting.name
                }
            }
        )
        return true;
    } catch (error) {
        throw (error);
    }
};

const isEnable = async function (setting) {
    try {
        const toCheck = await model.settingModel.findOne({
            where: {
                UserId: setting.userID,
                name: setting.name
            }
        });

        if (toCheck) {
            return String(toCheck.status) == 'true' ? true : false;
        } else {
            return false;
        }

    } catch (error) {
        throw (error);
    }
};

const selectSetting = async function (setting) {
    try {
        return await model.settingModel.findOne({
            where: {
                UserId: setting.userID,
                name: setting.name
            }
        });

    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectAllSettings,
    updateSetting,
    isEnable,
    selectSetting
};