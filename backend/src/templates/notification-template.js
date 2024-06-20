require('dotenv').config();

const createNotification = function (payload) {
    if (payload.title === process.env.TITLE_UPCOMING_EVENT) {
        return {
            title: payload.title,
            message:
                `The conference ${payload.confName} that you are following has an upcoming event. ${payload.detail}.`
        };
    }
    else if (payload.title === process.env.TITLE_NEW_UPDATED_EVENT) {
        return {
            title: payload.title,
            message:
                `The conference ${payload.confName} that you are following has new updated. ${payload.detail}.`
        };
    }
    else if (payload.title === process.env.TITLE_CANCELLED_EVENT) {
        return {
            title: payload.title,
            message:
                `The conference ${payload.confName} that you are following has cancelled an event. ${payload.detail}.`
        };
    }
    else if (payload.title === process.env.TITLE_CANCELLED_CONFERENCE) {
        return {
            title: payload.title,
            message:
                `The conference ${payload.confName} that you are following has been deleted from ConferenceHub.`
        };
    }
}

module.exports = {
    createNotification
}