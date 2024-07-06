const userRouter = require('./user-router');
const conferenceCFPRouter = require('./conference-cfp-router');
const sourceRouter = require('./source-router')
const conferenceRouter = require('./conference-router');
const fieldOfResearchRouter = require('./field-of-research-router');
const followRouter = require('./follow-router');
const postRouter = require('./post-router');
const dateRouter = require('./important-date-router');
const organizationRouter = require('./organization-router');
const calenderNoteRouter = require('./calender-note-router');
const feedbackRouter = require('./feedback-router');
const notificationRouter = require('./notification-router');
const rankRouter = require('./rank-router');
const viewRouter = require('./view-router');
const dashboardRouter = require('./dashboard-router');
const gmailLoginRouter = require('./gmail-login-router');
const jobRouter = require('./job-router');
const updateCycleRouter = require('./update-cycle-router');

module.exports = function (app) {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/conference', conferenceCFPRouter);
    app.use('/api/v1/source', sourceRouter);
    app.use('/api/v1/conf', conferenceRouter);
    app.use('/api/v1/for', fieldOfResearchRouter);
    app.use('/api/v1/follow', followRouter);
    app.use('/api/v1/post', postRouter);
    app.use('/api/v1/date', dateRouter);
    app.use('/api/v1/org', organizationRouter);
    app.use('/api/v1/note', calenderNoteRouter);
    app.use('/api/v1/feedback', feedbackRouter);
    app.use('/api/v1/notification', notificationRouter);
    app.use('/api/v1/rank', rankRouter);
    app.use('/api/v1/view', viewRouter);
    app.use('/api/v1/dashboard', dashboardRouter);
    app.use('/auth/google', gmailLoginRouter);
    app.use('/api/v1/job', jobRouter);
    app.use('/api/v1/cycle', updateCycleRouter);
}