const userRouter = require('./user-router');
const conferenceRouter = require('./conference-router');

module.exports = function(app) {
    app.use('/api/v1/user', userRouter);
    app.use('/api/v1/conference', conferenceRouter);
}