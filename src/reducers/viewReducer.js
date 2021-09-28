function viewReducer(state={
    view: 'home',
    profileToView: null
}, action={}){
    switch(action.type){
        case 'VIEW_PROFILE':
            return {view: 'profile', profileToView: action.value};
        case 'HOME':
            return {view: 'home', profileToView: null};
        default:
            return state;
    };
};
export default viewReducer;