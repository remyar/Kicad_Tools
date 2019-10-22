import Action from '../actions';

const initialState = {
    data: [],
    isLoading: false,
    error: undefined
}

export default function dataReducer (state = initialState, action) {
    switch (action.type) {
        case ( Action.kicad_file.KICAD_CREATE_BOM_PRO_START ):
        case ( Action.kicad_file.KICAD_CREATE_BOM_START ):{
            return {
                ...state,
                data: [],
                isLoading: true,
            }
        }
        case ( Action.kicad_file.KICAD_CREATE_BOM_SUCCESS  ):{
            return {
                ...state,
                isLoading: false,
                data: action.data
            }
        }
        case ( Action.kicad_file.KICAD_CREATE_BOM_ERROR ):{
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