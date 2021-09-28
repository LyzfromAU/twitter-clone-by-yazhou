function userReducer(state={
    email: localStorage.getItem('twitter-clone-user-email'),
    isLoggedIn: localStorage.getItem('twitter-clone-user-status'),
    id: localStorage.getItem('twitter-clone-user-id'),
}, action={}){
    switch(action.type){
        case 'GET_USER':
            return {email: action.value, isLoggedIn: true, id: action.id};
        case 'REMOVE_USER':
            return {email: "", isLoggedIn: false, id: ""};
        default:
            return state;
    };
};
export default userReducer;