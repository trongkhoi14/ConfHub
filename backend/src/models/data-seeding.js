const conferenceModel = require('./conference-model')

function seeding() {
    let list = [
        new conferenceModel({
            name: '2 conf',
            acronym: '2',
            fieldOfResearch: 'A for',
            source: 'CORE2023',
            rank: 'A',
            date: new Date('1/1/2011'),
            location: 'A loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://A',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('10/1/2011'),
                    notificationDate: new Date('10/1/2011'),
                    cameraReady: new Date('10/1/2011'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('10/1/2011'),
                    notificationDate: new Date('10/1/2011'),
                    cameraReady: new Date('10/1/2011'),
                }
            ],
        }),
        new conferenceModel({
            name: '3 conf',
            acronym: '3',
            fieldOfResearch: 'B for',
            source: 'CORE2023',
            rank: 'B',
            date: new Date('1/1/2012'),
            location: 'B loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://B',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('10/1/2012'),
                    notificationDate: new Date('10/1/2012'),
                    cameraReady: new Date('10/1/2012'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('10/1/2012'),
                    notificationDate: new Date('10/1/2012'),
                    cameraReady: new Date('10/1/2012'),
                }
            ],
        }),
        new conferenceModel({
            name: '4 conf',
            acronym: '4',
            fieldOfResearch: 'C for',
            source: 'CORE2023',
            rank: 'C',
            date: new Date('1/1/2013'),
            location: 'C loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://C',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('10/1/2013'),
                    notificationDate: new Date('10/1/2013'),
                    cameraReady: new Date('10/1/2013'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('10/1/2013'),
                    notificationDate: new Date('10/1/2013'),
                    cameraReady: new Date('10/1/2013'),
                }
            ],
        }),
        new conferenceModel({
            name: '5 conf',
            acronym: '5',
            fieldOfResearch: 'D for',
            source: 'CORE2023',
            rank: 'D',
            date: new Date('1/1/2014'),
            location: 'D loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://D',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('10/1/2014'),
                    notificationDate: new Date('10/1/2014'),
                    cameraReady: new Date('10/1/2014'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('10/1/2014'),
                    notificationDate: new Date('10/1/2014'),
                    cameraReady: new Date('10/1/2014'),
                }
            ],
        }),
        new conferenceModel({
            name: '6 conf',
            acronym: '6',
            fieldOfResearch: 'E for',
            source: 'CORE2023',
            rank: 'E',
            date: new Date('1/1/2023'),
            location: 'E loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://E',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('10/1/2023'),
                    notificationDate: new Date('10/1/2023'),
                    cameraReady: new Date('10/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('10/1/2023'),
                    notificationDate: new Date('10/1/2023'),
                    cameraReady: new Date('10/1/2023'),
                }
            ],
        }),
        new conferenceModel({
            name: '7 conf',
            acronym: '7',
            fieldOfResearch: 'F for',
            source: 'CORE2023',
            rank: 'F',
            date: new Date('1/1/2023'),
            location: 'F loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://F',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                }
            ],
        }),
        new conferenceModel({
            name: '8 conf',
            acronym: '8',
            fieldOfResearch: 'G for',
            source: 'CORE2023',
            rank: 'G',
            date: new Date('1/1/2023'),
            location: 'G loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://G',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                }
            ],
        }),
        new conferenceModel({
            name: '9 conf',
            acronym: '9',
            fieldOfResearch: 'H for',
            source: 'CORE2023',
            rank: 'H',
            date: new Date('1/1/2023'),
            location: 'H loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://H',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                }
            ],
        }),
        new conferenceModel({
            name: '10 conf',
            acronym: '10',
            fieldOfResearch: 'I for',
            source: 'CORE2023',
            rank: 'I',
            date: new Date('1/1/2023'),
            location: 'I loc',
            type: 'online',
            impactFactor: '95.5',
            link: 'https://I',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                }
            ],
        }),
        new conferenceModel({
            name: 'J conf',
            acronym: 'J',
            fieldOfResearch: 'J for',
            source: 'CORE2023',
            rank: 'J',
            date: new Date('1/1/2023'),
            location: 'J loc',
            type: 'offline',
            impactFactor: '95.5',
            link: 'https://J',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                }
            ],
        }),
        new conferenceModel({
            name: 'Q conf',
            acronym: 'Q',
            fieldOfResearch: 'J for',
            source: 'CORE2023',
            rank: 'J',
            date: new Date('1/1/2023'),
            location: 'J loc',
            type: 'offline',
            impactFactor: '95.5',
            link: 'https://J',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                }
            ],
        }),
        new conferenceModel({
            name: 'K conf',
            acronym: 'K',
            fieldOfResearch: 'K for',
            source: 'CORE2023',
            rank: 'K',
            date: new Date('1/1/2023'),
            location: 'K loc',
            type: 'offline',
            impactFactor: '95.5',
            link: 'https://K',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                }
            ],
        }),
        new conferenceModel({
            name: 'A conf',
            acronym: 'A',
            fieldOfResearch: 'J for',
            source: 'CORE2023',
            rank: 'J',
            date: new Date('1/1/2023'),
            location: 'J loc',
            type: 'offline',
            impactFactor: '95.5',
            link: 'https://J',
            rating: {
                welcoming: '5',
                feedback: '5',
                networking: '5',
                interaction: '5',
                topPeople: '5',
                worthwhile: '5',
                avgRating: '5',
            },
            callForPapers: [{
                content: 'Hello world',
                note: '',
            }],
            document: [
                {
                    documentName: 'Paper',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                },
                {
                    documentName: 'Abstract',
                    submissionDate: new Date('1/1/2023'),
                    notificationDate: new Date('1/1/2023'),
                    cameraReady: new Date('1/1/2023'),
                }
            ],
        }),
    ]

    list.forEach(i => {
        i.save().then(
            console.log(`Save ${i.name} to db`)
        )
    });
}

module.exports = {
    seeding
}