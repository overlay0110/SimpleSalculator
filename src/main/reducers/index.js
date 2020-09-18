import { combineReducers } from 'redux';
import commonReducers from './commonReducers';

// const allReducers = combineReducers({
//     countReducer,
// });

let allReducers = {
    commonReducers,
}

export default allReducers;
