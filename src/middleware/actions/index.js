export default (fn) => {
    const factory = (...args) => (dispatch, getState, extra) => {
        try {
            return fn(...args, { getState, dispatch, extra });
        } catch (error) {
            throw error;
        }
    }

    return factory;
}