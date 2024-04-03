const userModel = require('./user-model')
const conferenceModel = require('./conference-model')
const callForPaperModel = require('./call-for-paper-model')
const sourceModel = require('./source-model')
const fieldOfResearchModel = require('./field-of-research-model')
const cfpForModel = require('./cfp-for-model')
const importantDateModel = require('./important-date-model')
const organizationModel = require('./organization-model')
const followModel = require('./follow-model')
const postModel = require('./post-model')
const feedbackModel = require('./feedback-model')

conferenceModel.hasMany(callForPaperModel)
callForPaperModel.belongsTo(conferenceModel)

sourceModel.hasMany(callForPaperModel)
callForPaperModel.belongsTo(sourceModel)

callForPaperModel.hasMany(cfpForModel)
cfpForModel.belongsTo(callForPaperModel)
fieldOfResearchModel.hasMany(cfpForModel)
cfpForModel.belongsTo(fieldOfResearchModel)

callForPaperModel.hasMany(importantDateModel)
importantDateModel.belongsTo(callForPaperModel)

callForPaperModel.hasMany(organizationModel)
organizationModel.belongsTo(callForPaperModel)

userModel.hasMany(followModel)
followModel.belongsTo(userModel)
callForPaperModel.hasMany(followModel)
followModel.belongsTo(callForPaperModel)

userModel.hasMany(postModel)
postModel.belongsTo(userModel)
callForPaperModel.hasOne(postModel)
postModel.belongsTo(callForPaperModel)

userModel.hasMany(feedbackModel)
feedbackModel.belongsTo(userModel)
callForPaperModel.hasMany(feedbackModel)
feedbackModel.belongsTo(callForPaperModel)

module.exports = {
    userModel,
    conferenceModel,
    callForPaperModel,
    sourceModel,
    fieldOfResearchModel,
    cfpForModel,
    importantDateModel,
    organizationModel,
    followModel,
    postModel,
    feedbackModel,
}