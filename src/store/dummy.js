export default{
    actions : {
        consolePrint :({ commit }, text) => {
            commit({
                type: 'consolePrint',
                text
            });
        }
    }
} 