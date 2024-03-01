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
            console.log(action.payload)
            return {
                ...state,
                keywordFilter: [...state.keywordFilter, action.payload],

                optionsSelected: {
                    ...state.optionsSelected,
                    [action.payload.label]: action.payload.keywords,
                },
            }
        case actionTypes.ADD_FILTER_SUBMISSION_DATE:
            return {
                ...state,
                submissionDate: { ...state.submissionDate, ...action.payload }
            }
        case actionTypes.ADD_FILTER_CONFERENCE_DATE:
            return {
                ...state,
                confDate: { ...state.confDate, ...action.payload },
            }
        case actionTypes.REMOVE_FILTER:
            console.log(action.payload)

            return {
                ...state,
                optionsSelected: {
                    ...state.optionsSelected,
                    [action.payload.label]: action.payload.updateOptions,
                },
                fetchedResults: action.payload.updateResults,
            }
        case actionTypes.CLEAR_FILTERS:
            // Cập nhật state với fetchedResults đã xóa hết giá trị
            return {
                ...state,
                fetchedResults: action.payload.clearedFetchedResults,
                optionsSelected: action.payload.clearedOptionsSelected
            };


        case actionTypes.GET_RESULT_AFTER_FILTER:
            return {
                ...state,
                fetchedResults: {
                    ...state.fetchedResults,
                    [action.payload.option]: [...action.payload.results]

                },
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