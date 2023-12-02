const { Console } = require('winston/lib/winston/transports');
const {status} = require('./../constants');
const model = require('./../models')

class ConferenceController {
    // [GET] /api/v1/conference/
    getAllConference = async (req, res, next) => {
        const page = req.query.page || 1
        const size = req.query.size || 5
        var skip = page * size - size
        let result = []
        let msg = ``
        // Trỏ xuống model lấy dữ liệu
        let quantity = await model.conferenceModel.getQuantity()
        var max_page = Math.ceil(quantity[0].value * 1.0 / size)
        if (page > max_page || page < 1) {
            msg = `Page is not existed.`
        } else {
            const conferences = await model.conferenceModel.getAllConference(skip, size);
            let psize = conferences.length
            for (let i = 0; i < psize; i++) {
                const id = conferences[i].conf_id
                const info = await model.conferenceModel.getConference(id)
                const foRs = await model.fieldOfResearchModel.getConferenceFOR(id)
                const cfps = await model.callForPaperModel.getConferenceCFP(id)
                const avgRate = await model.avgRating.getConferenceRating(id)
                const dates = await model.importantDate.getImportantDate(id)
                let conference = { 
                    info: {}, 
                    foR: [],
                    cfp: [],
                    rating: {},
                    date: []
                }
                if (info) {
                    conference.info = info
                }
                if (foRs) {
                    for (let i = 0; i < foRs.length; i++) {
                        conference.foR.push(foRs[i].for_name)
                    }
                }
                if (cfps) {
                    for (let i = 0; i < cfps.length; i++) {
                        conference.cfp.push(cfps[i])
                    }
                }
                if (avgRate) {
                    conference.rating = avgRate
                }
                if (dates) {
                    for (let i = 0; i < dates.length; i++) {
                        let date_id = dates[i].date_id
                        let sub_dates = await model.submissionDate.getSubmissionDate(date_id)
                        let noti_dates = await model.notificationDate.getNotificationDate(date_id)
                        let camera_readys = await model.cameraReady.getCameraReady(date_id)
                        let detail_date = {sub_dates, noti_dates, camera_readys}
                        let date = {...dates[i], ...detail_date}
                        conference.date.push(date)
                    }
                }
                result.push(conference)
            }
            msg = `Get all ${psize} conferences at page ${page} successfully`
        }    
        try {
            res.status(status.OK).json({
                message: msg,
                data: result
            })
        } catch(err) {
            next(err);
        }
    }

    // [GET] /api/v1/conference?id/detail
    getConference = async (req, res, next) => {
        const id = req.params?.id
        let result = { 
            info: {}, 
            foR: [],
            cfp: [],
            rating: {},
            date: []
        }
        let msg = ''
        // Trỏ xuống model lấy dữ liệu 
        const info = await model.conferenceModel.getConference(id)
        const foRs = await model.fieldOfResearchModel.getConferenceFOR(id)
        const cfps = await model.callForPaperModel.getConferenceCFP(id)
        const avgRate = await model.avgRating.getConferenceRating(id)
        const dates = await model.importantDate.getImportantDate(id)
        
        if (info) {
            result.info = info
        }
        if (foRs) {
            for (let i = 0; i < foRs.length; i++) {
                result.foR.push(foRs[i].for_name)
            }
        }
        if (cfps) {
            for (let i = 0; i < cfps.length; i++) {
                result.cfp.push(cfps[i])
            }
        }
        if (avgRate) {
            result.rating = avgRate
        }
        if (dates) {
            for (let i = 0; i < dates.length; i++) {
                let date_id = dates[i].date_id
                let sub_dates = await model.submissionDate.getSubmissionDate(date_id)
                let noti_dates = await model.notificationDate.getNotificationDate(date_id)
                let camera_readys = await model.cameraReady.getCameraReady(date_id)
                let detail_date = {sub_dates, noti_dates, camera_readys}
                let date = {...dates[i], ...detail_date}
                result.date.push(date)
            }
        }
        let cond = Object.keys(result.info).length > 0 ? true: false
        if (cond) {
            msg = `Get conference ${id} successfully`
        } else {
            msg = `conference ${id} is not existed`
        }
        try {
            res.status(status.OK).json({
                message: msg,
                data: result
            })
        } catch(err) {
            next(err);
        }
    }
}

module.exports = ConferenceController;