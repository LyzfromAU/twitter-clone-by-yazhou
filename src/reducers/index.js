import { combineReducers } from 'redux';
import userReducer from './userReducer';
import viewReducer from './viewReducer';


const allReducers = combineReducers({
    user: userReducer,
    view: viewReducer,
});

export default allReducers;