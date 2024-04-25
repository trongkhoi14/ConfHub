const FieldOfResearch = require("../models/field-of-research-model");

module.exports = {
    CallForPaperQuery: require("./cfp-queries"),
    NoteQuery: require("./note-queries"),
    UserQuery: require("./user-queries"),
    SourceQuery: require("./source-queries"),
    FieldOfResearchQuery: require("./for-queries"),
    ConferenceQuery: require("./conference-queries"),
    PostQuery: require("./post-queries"),
    ImportantDatesQuery: require("./important-date-queries"),
    OrganizationQuery: require("./organization-queries"),
}