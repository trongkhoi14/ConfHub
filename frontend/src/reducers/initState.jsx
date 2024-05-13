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
  appliedFilterResult: {
    //lưu kết quả đã filter theo từng tiêu chí
    location: [], 
    rank: [], 
    for: [], 
    source: [],
    acronym: [],
    type: [],
    date: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },

  optionsSelected: {
    location: [],
    rank: [], 
    for: [], 
    source: [], 
    acronym: [], 
    type: [],
    date: [],
    submissionDate: [],
    search: [],
    impactfactor: [],
    rating: [],
    category: [],
  },

  keywordFilter: [],//filter
  resultFilter: [],

  
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

