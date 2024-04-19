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
  filterOptions: [],
  filterResults: [],
  fetchedResults: {
    location: [], //['Vietnam', 'Silicon Valley', 'San Francisco', 'Seattle', 'Austin']
    rank: [], //["A", "B"]
    for: [], //['4605 - Machine Learning', '']
    source: [], //['Score2023', 'Score2024']
    acronym: [], //['ACM', 'KDD']
    type: [],
    date: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },

  optionsSelected: {
    location: [], //['Vietnam', 'Silicon Valley', 'San Francisco', 'Seattle', 'Austin']
    rank: [], //["A", "B"]
    for: [], //['4605 - Machine Learning', '']
    source: [], //['Score2023', 'Score2024']
    acronym: [], //['ACM', 'KDD']
    type: [],
    date: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },

  keywordFilter: [],//filter

  
  listFollowed: [],
  //filter in auth page
  filterAuth: [],
  filterOptionsAuth:  {
    locations: [],
    ranks: [],
    fors: [],
    sources: [],
    acronyms: [],
    types: [],
    date: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },

};

