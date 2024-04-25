const query = require("../utils/queries.js");
const { status } = require('../constants/index.js');
const asyncHandler = require('express-async-handler');

class OrganizationController {
    getConferenceOrganizations = asyncHandler(async (req, res, next) => {
        try {
            const cfpID = req.body.cfp_id;
            const organiztions = query.OrganizationQuery.selectConferenceDates(cfpID);
            // permission
            return res.status(status.OK).json({
                message: "Get all organiztions of this conference successfully",
                data: organiztions
            });

        } catch (err) {
            next(err);
        }
    });

    deleteOrganizationByID = asyncHandler(async (req, res, next) => {
        const orgID = req.params?.id;
        await query.OrganizationQuery.deleteOrganizationByID(orgID);
        // permission
        return res.status(status.OK).json({
            message: "Delete successfully"
        });
    });
}

module.exports = OrganizationController;