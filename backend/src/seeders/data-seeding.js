const model = require('../models/index.js');
const sequelize = require('../config/database');
require('dotenv').config();

const conferenceSeeding = async () => {
    try {
        await sequelize.transaction(async (t) => {
            // Source
            const srcArr = await model.sourceModel.bulkCreate([
                { src_name: "CORE2023" },
                { src_name: "CORE2024" },
                { src_name: "CORE2025" }
            ], { transaction: t });

            // Conference
            const confArr = await model.conferenceModel.bulkCreate([
                { conf_name: "International Conference on Artificial Intelligence", acronym: "ICAI" },
                { conf_name: "International Conference on Computer Vision", acronym: "ICCV" },
                { conf_name: "International Conference on Bioinformatics", acronym: "ICB" },
                { conf_name: "International Conference on Robotics", acronym: "ICR" },
                { conf_name: "International Conference on Machine Learning", acronym: "ICML" },
                { conf_name: "International Conference on Data Mining", acronym: "ICDM" },
                { conf_name: "International Conference on Neuroscience", acronym: "ICN" },
                { conf_name: "International Conference on Renewable Energy", acronym: "ICRE" },
                { conf_name: "International Conference on Environmental Science", acronym: "ICES" },
                { conf_name: "International Conference on Nanotechnology", acronym: "ICNANO" },
            ], { transaction: t });

            // Field of research
            const forArr = await model.fieldOfResearchModel.bulkCreate([
                { for_name: "Artificial Intelligence" },
                { for_name: "Computer Vision" },
                { for_name: "Bioinformatics" },
                { for_name: "Robotics" },
                { for_name: "Machine Learning" },
                { for_name: "Data Mining" },
                { for_name: "Neuroscience" },
                { for_name: "Renewable Energy" },
                { for_name: "Environmental Science" },
                { for_name: "Nanotechnology" }
            ], { transaction: t });

            // Call for paper
            const cfpArr = await model.callForPaperModel.bulkCreate([
                {
                    content: "We invite submissions in all areas of AI.",
                    link: "https://www.icai2024.org",
                    rank: "A",
                    ConferenceConfId: confArr[0].conf_id,
                    SourceSrcId: srcArr[0].src_id
                },
                {
                    content: "Submissions are sought in all areas of computer vision research.",
                    link: "https://www.iccv2024.org",
                    rank: "A*",
                    ConferenceConfId: confArr[1].conf_id,
                    SourceSrcId: srcArr[0].src_id
                },
                {
                    content: "We welcome submissions in the field of bioinformatics and computational biology.",
                    link: "https://www.icb2024.org",
                    rank: "A",
                    ConferenceConfId: confArr[2].conf_id,
                    SourceSrcId: srcArr[0].src_id
                },
                {
                    content: "Submissions are solicited in all areas of robotics.",
                    link: "https://www.icr2024.org",
                    rank: "A",
                    ConferenceConfId: confArr[3].conf_id,
                    SourceSrcId: srcArr[0].src_id
                },
                {
                    content: "We seek submissions covering all aspects of machine learning.",
                    link: "https://www.icml2024.org",
                    rank: "A",
                    ConferenceConfId: confArr[4].conf_id,
                    SourceSrcId: srcArr[1].src_id
                },
                {
                    content: "Submissions are invited in the field of data mining and knowledge discovery.",
                    link: "https://www.icdm2024.org",
                    rank: "B",
                    ConferenceConfId: confArr[5].conf_id,
                    SourceSrcId: srcArr[1].src_id
                },
                {
                    content: "We welcome submissions in all areas of neuroscience.",
                    link: "https://www.icn2024.org",
                    rank: "B",
                    ConferenceConfId: confArr[6].conf_id,
                    SourceSrcId: srcArr[1].src_id
                },
                {
                    content: "We invite submissions on various aspects of renewable energy.",
                    link: "https://www.icre2024.org",
                    rank: "C",
                    ConferenceConfId: confArr[7].conf_id,
                    SourceSrcId: srcArr[2].src_id
                },
                {
                    content: "Submissions are sought in various areas of environmental science.",
                    link: "https://www.ices2024.org",
                    rank: "C",
                    ConferenceConfId: confArr[8].conf_id,
                    SourceSrcId: srcArr[2].src_id
                },
                {
                    content: "We welcome submissions in all areas of nanotechnology research.",
                    link: "https://www.icnano2024.org",
                    rank: "C",
                    ConferenceConfId: confArr[9].conf_id,
                    SourceSrcId: srcArr[2].src_id
                }
            ], { transaction: t });

            // CfpFor
            await model.cfpForModel.bulkCreate([
                {
                    CallForPaperCfpId: cfpArr[0].cfp_id,
                    FieldOfResearchForId: forArr[0].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[1].cfp_id,
                    FieldOfResearchForId: forArr[1].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[2].cfp_id,
                    FieldOfResearchForId: forArr[2].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[3].cfp_id,
                    FieldOfResearchForId: forArr[3].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[4].cfp_id,
                    FieldOfResearchForId: forArr[4].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[5].cfp_id,
                    FieldOfResearchForId: forArr[5].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[6].cfp_id,
                    FieldOfResearchForId: forArr[6].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[7].cfp_id,
                    FieldOfResearchForId: forArr[7].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[8].cfp_id,
                    FieldOfResearchForId: forArr[8].for_id
                },
                {
                    CallForPaperCfpId: cfpArr[9].cfp_id,
                    FieldOfResearchForId: forArr[9].for_id
                }
            ], { transaction: t })

            // Organization
            await model.organizationModel.bulkCreate([
                {
                    type: "hybrid",
                    location: "London, UK - Zoom",
                    start_date: "2024-09-15",
                    end_date: "2024-09-18",
                    CallForPaperCfpId: cfpArr[0].cfp_id
                },
                {
                    type: "offline",
                    location: "Tokyo, Japan",
                    start_date: "2024-10-05",
                    end_date: "2024-10-08",
                    CallForPaperCfpId: cfpArr[1].cfp_id
                },
                {
                    type: "online",
                    location: "Zoom",
                    start_date: "2024-07-20",
                    end_date: "2024-07-23",
                    CallForPaperCfpId: cfpArr[2].cfp_id
                },
                {
                    type: "hybrid",
                    location: "Berlin, Germany - Microsoft Teams",
                    start_date: "2024-08-10",
                    end_date: "2024-08-13",
                    CallForPaperCfpId: cfpArr[3].cfp_id
                },
                {
                    type: "offline",
                    location: "Paris, France",
                    start_date: "2025-06-25",
                    end_date: "2025-06-28",
                    CallForPaperCfpId: cfpArr[4].cfp_id
                },
                {
                    type: "online",
                    location: "Microsoft Teams",
                    start_date: "2025-11-10",
                    end_date: "2025-11-13",
                    CallForPaperCfpId: cfpArr[5].cfp_id
                },
                {
                    type: "offline",
                    location: "Barcelona, Spain",
                    start_date: "2025-09-30",
                    end_date: "2025-10-03",
                    CallForPaperCfpId: cfpArr[6].cfp_id
                },
                {
                    type: "hybrid",
                    location: "Sydney, Australia - Tiktok",
                    start_date: "2026-07-05",
                    end_date: "2026-07-08",
                    CallForPaperCfpId: cfpArr[7].cfp_id
                },
                {
                    type: "online",
                    location: "Zoom",
                    start_date: "2026-11-20",
                    end_date: "2026-11-23",
                    CallForPaperCfpId: cfpArr[8].cfp_id
                },
                {
                    type: "offline",
                    location: "Singapore",
                    start_date: "2026-08-20",
                    end_date: "2026-08-23",
                    CallForPaperCfpId: cfpArr[9].cfp_id
                }
            ], { transaction: t })

            // Important Dates
            await model.importantDateModel.bulkCreate([
                {
                    date_type: "submission date",
                    date_value: "2024-05-15",
                    status: "new",
                    CallForPaperCfpId: cfpArr[0].cfp_id
                },
                {
                    date_type: "notification date",
                    date_value: "2024-07-15",
                    status: "new",
                    CallForPaperCfpId: cfpArr[0].cfp_id
                },
                {
                    date_type: "camera ready",
                    date_value: "2024-08-15",
                    status: "new",
                    CallForPaperCfpId: cfpArr[0].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2024-06-01",
                    status: "new",
                    CallForPaperCfpId: cfpArr[1].cfp_id
                },
                {
                    date_type: "notification date",
                    date_value: "2024-07-30",
                    status: "new",
                    CallForPaperCfpId: cfpArr[1].cfp_id
                },
                {
                    date_type: "camera ready",
                    date_value: "2024-08-30",
                    status: "new",
                    CallForPaperCfpId: cfpArr[1].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2024-03-15",
                    status: "old",
                    CallForPaperCfpId: cfpArr[2].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2024-05-20",
                    status: "new",
                    CallForPaperCfpId: cfpArr[2].cfp_id
                },
                {
                    date_type: "camera ready",
                    date_value: "2024-06-20",
                    status: "new",
                    CallForPaperCfpId: cfpArr[2].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2024-04-30",
                    status: "new",
                    CallForPaperCfpId: cfpArr[3].cfp_id
                },
                {
                    date_type: "notification date",
                    date_value: "2024-06-10",
                    status: "new",
                    CallForPaperCfpId: cfpArr[3].cfp_id
                },
                {
                    date_type: "camera ready",
                    date_value: "2024-07-10",
                    status: "new",
                    CallForPaperCfpId: cfpArr[3].cfp_id
                },
                {
                    date_type: "abstract due",
                    date_value: "2025-02-15",
                    status: "new",
                    CallForPaperCfpId: cfpArr[4].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2025-04-25",
                    status: "new",
                    CallForPaperCfpId: cfpArr[4].cfp_id
                },
                {
                    date_type: "camera ready",
                    date_value: "2025-05-25",
                    status: "new",
                    CallForPaperCfpId: cfpArr[4].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2025-08-30",
                    status: "new",
                    CallForPaperCfpId: cfpArr[5].cfp_id
                },
                {
                    date_type: "notification date",
                    date_value: "2025-09-30",
                    status: "new",
                    CallForPaperCfpId: cfpArr[5].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2025-07-01",
                    status: "old",
                    CallForPaperCfpId: cfpArr[5].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2025-05-30",
                    status: "new",
                    CallForPaperCfpId: cfpArr[6].cfp_id
                },
                {
                    date_type: "notification date",
                    date_value: "2025-07-30",
                    status: "new",
                    CallForPaperCfpId: cfpArr[6].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2026-07-15",
                    status: "old",
                    CallForPaperCfpId: cfpArr[8].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2026-07-20",
                    status: "new",
                    CallForPaperCfpId: cfpArr[8].cfp_id
                },
                {
                    date_type: "notification date",
                    date_value: "2026-09-20",
                    status: "new",
                    CallForPaperCfpId: cfpArr[8].cfp_id
                },
                {
                    date_type: "camera ready",
                    date_value: "2026-10-20",
                    status: "new",
                    CallForPaperCfpId: cfpArr[8].cfp_id
                },
                {
                    date_type: "submission date",
                    date_value: "2026-04-20",
                    status: "new",
                    CallForPaperCfpId: cfpArr[9].cfp_id
                },
                {
                    date_type: "camera ready",
                    date_value: "2026-07-20",
                    status: "new",
                    CallForPaperCfpId: cfpArr[9].cfp_id
                }
            ], { transaction: t })
        });
        console.log("Finished seeding conference data.");

    } catch (error) {
        console.log("Failed when seeding conference data: " + error);
    }
}

const adminSeeding = async () => {
    try {
        const isExited = await model.userModel.findOne({
            where: { email: "admin1@gmail.com" }
        });
        if (!isExited) {
            const admin = await model.userModel.create({
                name: "Admin",
                phone: "0123456789",
                email: "admin1@gmail.com",
                address: "HCMUS, Ho Chi Minh City, Vietnam",
                nationality: "Vietnam",
                password: "123456",
                role: "admin",
                license: "true"
            });
            console.log("Finished seeding admin data.");
        }

    } catch (error) {
        console.log("Failed when seeding admin data: " + error);
    }
};

const dataSeeding = async (options) => {
    try {
        if (options.includes('admin')) await adminSeeding();
        if (options.includes('conferences')) await conferenceSeeding();

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    dataSeeding
}
