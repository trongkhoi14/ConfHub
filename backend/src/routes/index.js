const userRouter = require('./user-router');
const conferenceCFPRouter = require('./conference-cfp-router');
const sourceRouter = require('./source-router')
const conferenceRouter = require('./conference-router');
const fieldOfResearchRouter = require('./field-of-research-router');
const followRouter = require('./follow-router');
const postRouter = require('./post-router');

module.exports = function(app) {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/conference', conferenceCFPRouter);
    app.use('/api/v1/source', sourceRouter);
    app.use('/api/v1/conf', conferenceRouter);
    app.use('/api/v1/for', fieldOfResearchRouter);
    app.use('/api/v1/follow', followRouter);
    app.use('/api/v1/post', postRouter);
}