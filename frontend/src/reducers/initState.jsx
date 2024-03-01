export const initialState = {
  user: null,
  loading: false,
  error: null,
  
  conferences: [],
  conference: null,
  notifications: [],
  isFollow: false,//????

  popularConf: [], //conference có nhiều follow


  //filter
  maxpage: 0,
  amount: 0,
  filterOptions: null,
  filterResults: [],
  fetchedResults: {
    locations: [], //['Vietnam', 'Silicon Valley', 'San Francisco', 'Seattle', 'Austin']
    ranks: [], //["A", "B"]
    fors: [], //['4605 - Machine Learning', '']
    sources: [], //['Score2023', 'Score2024']
    acronyms: [], //['ACM', 'KDD']
    types: [],
    holdingDate: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    categories: [],
  },

  optionsSelected: {
    locations: [], //['Vietnam', 'Silicon Valley', 'San Francisco', 'Seattle', 'Austin']
    ranks: [], //["A", "B"]
    fors: [], //['4605 - Machine Learning', '']
    sources: [], //['Score2023', 'Score2024']
    acronyms: [], //['ACM', 'KDD']
    types: [],
    holdingDate: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    categories: [],
  },

  keywordFilter: [],//filter

  submissionDate: { from: "", to: "" }, //{from: "04/22/2023", to: "03/12/2024"}
  confDate: { from: "", to: "" }, //{from: "04/22/2023", to: "03/12/2024"}

  
  //follow
  listFollowed: [],
};

