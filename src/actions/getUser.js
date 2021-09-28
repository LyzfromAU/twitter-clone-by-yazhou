export const getUser = (value, id) => {
    return {
        type: 'GET_USER', value, id
    };
};