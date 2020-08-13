import Action from '../actions';

const initialState = {
    data: {},
    isLoading: false,
    error: undefined
}

export default function dataReducer(state = initialState, action) {
    switch (action.type) {
        case (Action.kicad_file.KICAD_SAVE_LIBRARIE_START):
        case (Action.kicad_file.KICAD_READ_LIBRARIE_START):{
            return {
                ...state,
                data: {},
                isLoading: true,
            }
        }
        case ( Action.kicad_file.KICAD_READ_LIBRARIE_SUCCESS  ):{
            return {
                ...state,
                isLoading: false,
                data: { ...action.data }
            }
        }
        default:
            return {...state , isLoading: false};
    }
}