const { formatDate } = require('../utils/date-handler');

module.exports = {
    upcomingEvent: (payload) => {
        return {
            title: payload.title,
            message:
                `Dear Sir/Madam, \n
                We would like to inform you about an upcoming event that is scheduled to take place soon: ${payload.confName} - ${payload.date}.\n
                Please be prepared to join this event and don't forget to mark your calendar!
                `
        };
    },
    updatedEvent: (payload) => {
        return {
            title: payload.title,
            message:
                `Dear Sir/Madam, \n
                We would like to inform you about an updated event from a conference you are following: ${payload.confName} - ${payload.date}.\n
                Please be prepared to join this event and don't forget to mark your calendar!
                `
        };
    },
    cancelledEvent: (payload) => {
        return {
            title: payload.title,
            message:
                `Dear Sir/Madam, \n
                We would like to inform you about an cancelled event of one of your followed conference: ${payload.confName} - ${payload.date}.\n
                Please be prepared to join this event and don't forget to mark your calendar!
                `
        };
    },
    cancelledConference: (payload) => {
        return {
            title: payload.title,
            message:
                `Dear Sir/Madam, \n
                We would like to inform you about an cancelled conference that you are following: ${payload.conference}.\n
                Please be prepared to join this event and don't forget to mark your calendar!
                `
        };
    },
}