import * as actionTypes from './../actions/actionTypes'

const appReducer = (state, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case actionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            };
        case actionTypes.LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case actionTypes.LOGOUT_USER:
            return {
                ...state,
                user: null,
                loading: false,
                error: null,
            };
        case actionTypes.REGISTRATION_REQUEST:
            return {
                ...state,
                loading: true,
                user: null,
                error: null,
            };

        case actionTypes.REGISTRATION_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                error: null,
            };

        case actionTypes.REGISTRATION_FAILURE:
            return {
                ...state,
                loading: false,
                user: null,
                error: action.payload,
            };
        case actionTypes.GET_OPTIONS_FILTER:
            return { ...state, filterOptions: action.payload }

        case actionTypes.ADD_FILTER:
            return {
                ...state,
                [action.payload.statename]: {
                  ...state[action.payload.statename],
                  [action.payload.label]: [
                    ...(state[action.payload.statename][action.payload.label] || []), // Nếu mảng không tồn tại, tạo một mảng mới
                    ...action.payload.keywords, // Thêm giá trị mới vào mảng
                  ],
                },
              };
        case actionTypes.ADD_FILTER_DATE:
            return {
                ...state,
                [action.payload.statename]: {
                    ...state[action.payload.statename],
                    [action.payload.label]: [...action.payload.keyword],
                  },
                fetchedResults: {
                    ...state.fetchedResults,
                    [action.payload.label]: action.payload.conferences,
                }
            }
        case actionTypes.REMOVE_FILTER:
            return {
                ...state,
                fetchedResults: action.payload.updatedResults,
                [action.payload.statename]: action.payload.updateOptionsSelected
            }
        case actionTypes.CLEAR_FILTERS:
            // Cập nhật state với fetchedResults đã xóa hết giá trị
            return {
                ...state,
                fetchedResults: action.payload.clearedFetchedResults,
                [action.payload.statename]: action.payload.clearedOptionsSelected
            };


        case actionTypes.GET_RESULT_AFTER_FILTER:
            return {
                ...state,
                fetchedResults: {
                  ...state.fetchedResults,
                  [action.payload.option]: [
                    ...state.fetchedResults[action.payload.option],
                    ...action.payload.results.map(item => item)
                  ]
                },
            };
        case actionTypes.REQUEST_CONFERENCE: 
            return {
                ...state,
                loading: true,
                conferences: null,
                error: null,
            };
        case actionTypes.GET_ALL_CONFERENCES:
            return {
                ...state,
                conferences: action.payload
            };
        case actionTypes.GET_ONE_CONFERENCE:
            return {
                ...state,
                conference: action.payload
            };
        case actionTypes.FOLLOW:
            return {
                ...state,
                listFollowed: [...state.listFollowed, action.payload],
            };
        case actionTypes.UNFOLLOW:
            return {
                ...state,
                listFollowed: state.listFollowed.filter(item => item.id !== action.payload.id),
            };
        default:
            return state;
    }
};

export default appReducer