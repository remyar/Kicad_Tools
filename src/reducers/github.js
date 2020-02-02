import Action from '../actions';

const initialState = {
    data: [],
    isLoading: false,
    error: undefined
}

export default function dataReducer (state = initialState, action) {
    switch (action.type) {
        case ( Action.github.GET_ALL_GITHUB_CATEGORIES_START ):{
            return {
                ...state,
                data: [],
                isLoading: true
            }
        }
        case ( Action.github.GET_ALL_GITHUB_CATEGORIES_SUCCESS  ):{
            return {
                ...state,
                isLoading: false,
                data: action.data
            }
        }
        case ( Action.github.GET_ALL_GITHUB_CATEGORIES_ERROR ):{
            return {
                ...state,
                isLoading: false,
                error : action.data
            }
        }
        default:
            return state;
    }
}