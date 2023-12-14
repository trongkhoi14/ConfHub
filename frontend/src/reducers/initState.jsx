export const initialState = {
  user: null,
  loading: false,
  error: null,

  conferences: [],
  notifications: [],
  isFollow: false,//????

  popularConf: [], //conference có nhiều follow

  filterOptions: {
    //trích từ database
    location: [], //['Vietnam', 'Silicon Valley', 'San Francisco', 'Seattle', 'Austin']
    rank: [], //["A", "B"]
    fieldOfResearch: [], //['4605 - Machine Learning', '']
    source: [], //['Score2023', 'Score2024']
    acronym: [], //['ACM', 'KDD']

    //default
    category: ["Conference", "Journal"],
    hold: ['Online', 'Offline'],
    rating: [5, 4, 3, 2, 1],  //for rank and impactfactor

  },
  keywordFilter: [],//filter

  submissionDate: { from: "", to: "" }, //{from: "04/22/2023", to: "03/12/2024"}
  confDate: { from: "", to: "" }, //{from: "04/22/2023", to: "03/12/2024"}
};