import {print} from '../import/helpers';
import { NavigationActions } from 'react-navigation';

// Default State
const initialState = {
    qrscan_data : null,
    qrscan_err_msg : '',
    qrscan_error : false,
};

// Actions
export const SET_QRDATA = "SET_QRDATA"

// Action Functions
export function setQrdata(value){
    return {
        type: SET_QRDATA,
        result : value,
    };
}

export function onSuccess(e){
    return (dispatch) => {
        dispatch(setQrdata(e.data));
        dispatch(NavigationActions.navigate({ routeName: 'WebView' }));
    }
}

// Reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_QRDATA:
            return {
                ...state,
                qrscan_data: action.result,
            }
    }
    return state;
}

// Exports Default
export default reducer;
