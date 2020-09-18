import {print, sha256, baseStr, getUrlDatas} from '../import/helpers';
import config from '../import/config';
import {select, update} from '../import/fileDB';
import strings from '../assets/locale';
import { NavigationActions, StackActions } from 'react-navigation';
import {setResponseUrl, setFirstRun} from './commonReducers';

// Default State
const initialState = {
    pinNum : '',
    previousPinNum : '',
    pinScreen : null,
    pinState : 'auth', // auth, reset
    pinScreenMsg : strings.password_input,
};

// Actions
export const SET_PINSCREEN = "SET_PINSCREEN";
export const SET_PIN_NUM = "SET_PIN_NUM";
export const SET_PREVIOUS_PIN_NUM = "SET_PREVIOUS_PIN_NUM";
export const PIN_SCREEN_ERROR_CLEAR = "PIN_SCREEN_ERROR_CLEAR";
export const PIN_SCREEN_ERROR_MSG = "PIN_SCREEN_ERROR_MSG";
export const GET_PIN_PASSWORD = "GET_PIN_PASSWORD";
export const SET_PIN_SCREEN_MSG = "SET_PIN_SCREEN_MSG";
export const SET_PIN_STATE = "SET_PIN_STATE";

// Action Functions
export function setPinScreen(ref){
    return {
        type: SET_PINSCREEN,
        ref : ref,
    };
}

export function setPinNum(num){
    return {
        type : SET_PIN_NUM,
        num : num,
    }
}

export function setPreviousPinNum(num){
    return {
        type : SET_PREVIOUS_PIN_NUM,
        num : num,
    }
}

export function pinScreenErrorClear(){
    return {
        type: PIN_SCREEN_ERROR_CLEAR
    };
}

export function pinScreenErrorMsg(msg){
    return {
        type: PIN_SCREEN_ERROR_MSG,
        msg : msg,
    };
}

export function setPinScreenMsg(msg){
    return {
        type : SET_PIN_SCREEN_MSG,
        msg : msg,
    }
}

export function setPinState(value){
    return {
        type : SET_PIN_STATE,
        state : value,
    }
}

export function recievePin(key){
    return (dispatch, getState) => {
        // Clear error on interaction
        dispatch(pinScreenErrorClear());
        dispatch(setPinNum(key));
        let pinSet = config.PIN_SET;
        let state = getState();
        const {pinState, previousPinNum} = state.pinAuthReducers;
        const {response_url, navigation} = state.commonReducers;
        const {current_url} = state.webViewReducers;

        if(key.length != pinSet.numberOfPins){
            return false;
        }

        dispatch(setPinNum(''));

        if(pinState == 'auth'){
            select('screenLock', '*', 'rowid=?', [3])
            .then(res => {
                print('recievePin', sha256(key+baseStr()), res[0].p);

                if(sha256(key+baseStr()) != res[0].p){
                    // 여러번 틀릴 경우 잠그기
                    dispatch(pinScreenErrorMsg(strings.password_error));
                }
                else{
                    dispatch(setFirstRun(false));
                    dispatch(NavigationActions.navigate({ routeName: 'WebView' }));
                }
            });
        }

        if(pinState == 'reset'){
            if(previousPinNum.trim().length == 0){
                dispatch(setPinScreenMsg(strings.re_input));
                dispatch(setPreviousPinNum(key));
                return false;
            }

            if(key != previousPinNum){
                dispatch(setPreviousPinNum(''));
                dispatch(setPinScreenMsg(strings.password_input));
                dispatch(pinScreenErrorMsg(strings.password_error_reset));
                return false;
            }

            if(response_url != null){
                let url_datas = getUrlDatas(current_url, 'app_pin_auth');
                dispatch(setResponseUrl(url_datas['response_url']));
            }

            update('screenLock', { i : sha256('pin'), p : sha256(key+baseStr()) }, 'rowid=?', [3]);
            dispatch(setPreviousPinNum(''));
            dispatch(setPinState('auth'));
            dispatch(setPinScreenMsg(strings.password_input));
            dispatch(NavigationActions.navigate({ routeName: 'WebView' }));
        }
    }
}

// Reducer
function reducer(state = initialState, action) {
    switch (action.type) {
        case SET_PINSCREEN:
            return {
                ...state,
                pinScreen: action.ref
            }
        case PIN_SCREEN_ERROR_CLEAR:
            if(state.pinScreen != undefined){
                state.pinScreen.clearError();
            }

            return {
                ...state,
            }
        case PIN_SCREEN_ERROR_MSG:
            if(state.pinScreen != undefined){
                state.pinScreen.throwError(action.msg);
            }

            return {
                ...state,
                pinNum : '',
            }
        case SET_PIN_NUM:
            return {
                ...state,
                pinNum : action.num,
            }
        case SET_PREVIOUS_PIN_NUM:
            return {
                ...state,
                previousPinNum : action.num,
                pinNum : '',
            }
        case SET_PIN_SCREEN_MSG:
            return {
                ...state,
                pinScreenMsg : action.msg,
            }
        case SET_PIN_STATE:
            return {
                ...state,
                pinState : action.state,
            }
    }
    return state;
}

// Exports Default
export default reducer;
