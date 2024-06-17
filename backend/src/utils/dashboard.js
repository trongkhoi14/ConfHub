const { UserLog, ETLLog } = require('../models/dashboard.js');
const User = require('../models/user-model.js');
require('dotenv').config();

const createNewLog = async function () {
    try {
        const today = new Date();
        const dateOnly = today.toDateString();

        const [u_log, u_created] = await UserLog.findOrCreate({
            where: { time: dateOnly },
            defaults: { time: dateOnly }
        });

        if (u_created) {
            console.log('[' + Date() + '] Create new user log record.');
        }

        const [e_log, e_created] = await ETLLog.findOrCreate({
            where: { time: dateOnly },
            defaults: { time: dateOnly }
        });

        if (e_created) {
            console.log('[' + Date() + '] Create new etl log record.');
        }

    } catch (error) {
        throw (error);
    }
};

const getUserLog = async function (conditions) {
    try {
        return await UserLog.findAll({
            where: conditions
        });
    } catch (error) {
        throw (error);
    }
}

const getETLLog = async function (conditions) {
    try {
        return await ETLLog.findAll({
            where: conditions
        });
    } catch (error) {
        throw (error);
    }
}

const increaseUserLog = async function () {
    try {
        const today = new Date();
        const dateOnly = today.toDateString();

        const log = await UserLog.findOne({ where: { time: dateOnly } });
        if (log) {
            log.total_visiters = log.total_visiters + 1;
            await log.save();
        }

        return log;

    } catch (error) {
        throw (error);
    }
}

const increaseETLLog = async function (duration) {
    try {
        const today = new Date();
        const dateOnly = today.toDateString();

        const log = await ETLLog.findOne({ where: { time: dateOnly } });
        if (log) {
            log.total_etl_processes = log.total_etl_processes + 1;
            log.duration = log.duration + Number(duration);
            await log.save();
        }

        return log;

    } catch (error) {
        throw (error);
    }
}

module.exports = {
    getETLLog,
    getUserLog,
    createNewLog,
    increaseETLLog,
    increaseUserLog
}