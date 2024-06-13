const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { conferenceData, updateToList } = require('../temp/index.js');
const { updatePost } = require('../utils/post-queries.js');


const crawlConferenceById = async (conferenceID, nkey) => {
    try {
        console.log(nkey);
        console.log('Đợi kết quả từ fetch')
        const response = await fetch(`https://conference-crawler-v2.onrender.com/api/scrape/conference/${nkey}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        console.log('Đợi JSON được phân tích')
        const data = await response.json();

        const updatedConference = {
            cfp_id: conferenceID,
            name: response.data.conf_name,
            acronym: response.data.acronym,
            callForPaper: response.data.callForPaper,
            link: response.data.link,
            source: response.data.source,
            rank: response.data.rank || 'N/I',
            owner: response.data.owner || 'crawler',
            nkey: response.data.nkey,
            fieldsOfResearch: response.data.fieldsOfResearch,
            organizations: response.data.organizations,
            importantDates: response.data.importantDates
        }
        // update post
        console.log(updatedConference);

    } catch (error) {
        console.log("Error in crawl conference by id: " + error);
    }
};

module.exports = {
    crawlConferenceById
}