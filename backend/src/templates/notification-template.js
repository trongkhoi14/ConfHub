const createNotification = function (payload) {
    if (payload.title = process.env.TITLE_UPCOMING_EVENT) {
        return {
            title: payload.title,
            message:
                `Dear Sir/Madam, We would like to inform you about an upcoming event that is scheduled to take place soon: ${payload.confName} - ${payload.detail}. Please be prepared to join this event and don't forget to mark your calendar!`
        };
    }
    else if (payload.title = process.env.TITLE_NEW_UPDATED_EVENT) {
        return {
            title: payload.title,
            message:
                `Dear Sir/Madam, We would like to inform you about an updated event from a conference you are following: ${payload.confName} - ${payload.detail}. Please be prepared to join this event and don't forget to mark your calendar!`
        };
    }
    else if (payload.title = process.env.TITLE_CANCELLED_EVENT) {
        return {
            title: payload.title,
            message:
                `Dear Sir/Madam, We would like to inform you about an cancelled event of one of your followed conference: ${payload.confName} - ${payload.detail}. Please be prepared to join this event and don't forget to mark your calendar!`
        };
    }
    else if (payload.title = process.env.TITLE_CANCELLED_CONFERENCE) {
        return {
            title: payload.title,
            message:
                `Dear Sir/Madam, We would like to inform you about an cancelled conference that you are following: ${payload.confName}. From now on, you will no longer find any information about this conference on ConferenceHub. Sorry for this inconvenience.`
        };
    }
}

module.exports = {
    createNotification
}