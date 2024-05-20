const userModel = require('./user-model');
const conferenceModel = require('./conference-model');
const callForPaperModel = require('./call-for-paper-model');
const sourceModel = require('./source-model');
const fieldOfResearchModel = require('./field-of-research-model');
const cfpForModel = require('./cfp-for-model');
const importantDateModel = require('./important-date-model');
const organizationModel = require('./organization-model');
const followModel = require('./follow-model');
const postModel = require('./post-model');
const feedbackModel = require('./feedback-model');
const calenderNoteModel = require('./calender-note-model');
const settingModel = require('./setting-model');
const notificationModel = require('./notification-model');

// Assocation
conferenceModel.hasMany(callForPaperModel, { onDelete: 'CASCADE' });
callForPaperModel.belongsTo(conferenceModel);

sourceModel.hasMany(callForPaperModel);
callForPaperModel.belongsTo(sourceModel);

callForPaperModel.hasMany(cfpForModel, { onDelete: 'CASCADE' });
cfpForModel.belongsTo(callForPaperModel);
fieldOfResearchModel.hasMany(cfpForModel, { onDelete: 'CASCADE' });
cfpForModel.belongsTo(fieldOfResearchModel);

callForPaperModel.hasMany(importantDateModel, { onDelete: 'CASCADE' });
importantDateModel.belongsTo(callForPaperModel);

callForPaperModel.hasMany(organizationModel, { onDelete: 'CASCADE' });
organizationModel.belongsTo(callForPaperModel);

userModel.hasMany(followModel, { onDelete: 'CASCADE' });
followModel.belongsTo(userModel);
callForPaperModel.hasMany(followModel, { onDelete: 'CASCADE' });
followModel.belongsTo(callForPaperModel);

userModel.hasMany(postModel, { onDelete: 'CASCADE' });
postModel.belongsTo(userModel);
callForPaperModel.hasOne(postModel, { onDelete: 'CASCADE' });
postModel.belongsTo(callForPaperModel);

userModel.hasMany(feedbackModel, { onDelete: 'CASCADE' });
feedbackModel.belongsTo(userModel);
callForPaperModel.hasMany(feedbackModel, { onDelete: 'CASCADE' });
feedbackModel.belongsTo(callForPaperModel);

userModel.hasMany(calenderNoteModel, { onDelete: 'CASCADE' });
calenderNoteModel.belongsTo(userModel);

importantDateModel.hasOne(calenderNoteModel, { onDelete: 'CASCADE' });
calenderNoteModel.belongsTo(importantDateModel);

organizationModel.hasOne(calenderNoteModel, { onDelete: 'CASCADE' });
calenderNoteModel.belongsTo(organizationModel);

followModel.hasMany(calenderNoteModel, { onDelete: 'CASCADE' });
calenderNoteModel.belongsTo(followModel);

userModel.hasMany(settingModel, { onDelete: 'CASCADE' });
settingModel.belongsTo(userModel);

followModel.hasMany(notificationModel);
notificationModel.belongsTo(followModel);

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
    calenderNoteModel,
    settingModel,
    notificationModel
}