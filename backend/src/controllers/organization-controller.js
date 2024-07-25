const query = require("../utils/queries.js");
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class OrganizationController {
    getConferenceOrganizations = asyncHandler(async (req, res, next) => {
        try {
            const cfpID = req.params?.id;
            const organiztions = await query.OrganizationQuery.selectConferenceOrganizations(cfpID);
            return res.status(status.OK).json({
                message: "Get all organiztions of this conference successfully",
                data: organiztions
            });

        } catch (err) {
            next(err);
        }
    });

    getOrganization = asyncHandler(async (req, res, next) => {
        try {
            const orgID = req.params?.id;
            const organiztion = await query.OrganizationQuery.selectOrganization(orgID);
            return res.status(status.OK).json({
                data: organiztion
            });

        } catch (err) {
            next(err);
        }
    });
}

module.exports = OrganizationController;