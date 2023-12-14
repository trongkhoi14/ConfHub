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

        case actionTypes.ADD_FILTER:
            return { ...state, keywordFilter: [...state.keywordFilter, action.payload], }
        case actionTypes.ADD_FILTER_SUBMISSION_DATE:
            return {
                ...state,
                submissionDate: { ...state.submissionDate, ...action.payload }
            }
        case actionTypes.ADD_FILTER_CONFERENCE_DATE:
            return {
                ...state,
                confDate: { ...state.confDate, ...action.payload }
            }
        case actionTypes.REMOVE_FILTER:
            return { ...state, keywordFilter: state.keywordFilter.filter(keyword => keyword !== action.payload) }
        case actionTypes.CLEAR_FILTERS:
            return {
                ...state,
                keywordFilter: []
            };
        default:
            return state;
    }
};

export default appReducer