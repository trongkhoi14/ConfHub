const dataPineline = async (conference) => {
    try {

        if (conference.Rank == 'C' || conference.Rank == 'B' || conference.Rank == 'A' || conference.Rank == 'A*') {
            let organizations = [];
            if (conference.ConferenceDate.length > 0) {
                organizations.push({
                    name: "default",
                    location: conference.Location ? conference.Location : "",
                    type: conference.Type ? conference.Type : "",
                    start_date: conference.ConferenceDate[0]?.date,
                    end_date: conference.ConferenceDate[1]?.date
                })
            }

            const importantDates = [
                ...conference.SubmissonDate.map((item) => ({
                    date_value: item.date,
                    date_type: item.keyword,
                })),
                ...conference.NotificationDate.map((item) => ({
                    date_value: item.date,
                    date_type: item.keyword,
                })),
                ...conference.CameraReady.map((item) => ({
                    date_value: item.date,
                    date_type: item.keyword,
                })),
            ];

            let forArr = conference.PrimaryFoR.map(getFieldOfRearchName);

            const conferenceObj = {
                name: conference.Title,
                acronym: conference.Acronym,
                callForPaper: conference.CallForPaper ? conference.CallForPaper : "Not found",
                link: conference.Links[0],
                rank: conference.Rank,
                fieldsOfResearch: forArr.length
                    ? forArr.filter(item => item != null)
                    : ["none"],
                importantDates: importantDates ? importantDates : [""],
                nkey: conference._id.toString(),
                organizations: organizations ? organizations : [""],
                source: conference.Source,
                owner: "admin",
                status: true,
            };

            return conferenceObj;
        }

        return null;

    } catch (error) {
        console.log("Error in datapipeline: ", error);
    }

};


const getFieldOfRearchName = (forCode) => {
    for (let i = 0; i < fieldOfRearchCategories.length; i++) {
        const category = fieldOfRearchCategories[i];
        if (category.hasOwnProperty(forCode)) {
            return category[forCode];
        }
    }
    return null;
};

const fieldOfRearchCategories = [
    {
        46: "Information and Computing Sciences",
    },
    {
        4601: "Applied computing",
    },
    {
        4602: "Artificial intelligence",
    },
    {
        4603: "Computer vision and multimedia computation",
    },
    {
        4604: "Cybersecurity and privacy",
    },
    {
        4605: "Data management and data science",
    },
    {
        4606: "Distributed computing and systems software",
    },
    {
        4607: "Graphics, augmented reality and games",
    },
    {
        4608: "Human-centred computing",
    },
    {
        4611: "Machine learning",
    },
    {
        4612: "Software engineering",
    },
    {
        4613: "Theory of computation",
    },
];

module.exports = {
    dataPineline
}