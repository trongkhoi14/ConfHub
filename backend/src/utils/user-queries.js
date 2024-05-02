const model = require('../models/index.js');
require('dotenv').config();

const selectUser = async function (userID) {
    try {
        return await model.userModel.findByPk(userID);
    } catch (error) {
        throw (error);
    }
};

module.exports = {
    selectUser
};