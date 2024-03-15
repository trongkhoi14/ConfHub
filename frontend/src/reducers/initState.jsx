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
    date: [],
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
    date: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    categories: [],
  },

  keywordFilter: [],//filter

  
  //follow
  listFollowed: [],
  filteFollow: [],
  filterOptionsFollowed:  {
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
    categories: [],
  },

};

