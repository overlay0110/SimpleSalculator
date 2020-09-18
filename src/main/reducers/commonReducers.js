import {print, configUrl} from '../import/helpers';

// Default State
const initialState = {
    loading : false,
    response_url : null,
    navigation : null,
    first_run : true,
    config : {},
    log_inputs : [],
    log_result : '',
};

// Actions
export const LOADING_START = "LOADING_START";
export const LOADING_STOP = "LOADING_STOP";
export const SET_RESPONSE_URL = "SET_RESPONSE_URL";
export const SET_NAVIGATION = "SET_NAVIGATION";
export const SET_FIRST_RUN = "SET_FIRST_RUN";
export const SET_CONFIG = "SET_CONFIG";
export const SET_LOG_DATA = "SET_LOG_DATA";

// Action Functions
export function loadingStart(){
    return {
        type : LOADING_START,
    }
}

export function loadingStop(){
    return {
        type : LOADING_STOP,
    }
}

export function setResponseUrl(url){
    return {
        type : SET_RESPONSE_URL,
        url : url,
    }
}

export function setNavigation(ref){
    return {
        type : SET_NAVIGATION,
        ref : ref,
    }
}

export function setFirstRun(value){
    return {
        type : SET_FIRST_RUN,
        value : value,
    }
}

export function setConfig(config){
    return {
        type : SET_CONFIG,
        config : config,
    }
}

export function setLogData(inputs, result){
    return {
        type : SET_LOG_DATA,
        log_inputs: inputs,
        log_result : result,
    }
}

// Reducer
function reducer(state = initialState, action) {
    // print('COMMON ACTION', action.type);
    switch (action.type) {
        case LOADING_START:
            return {
                ...state,
                loading: true,
            }
        case LOADING_STOP:
            return {
                ...state,
                loading: false,
            }
        case SET_RESPONSE_URL:
            return {
                ...state,
                response_url: action.url,
            }
        case SET_NAVIGATION:
            return {
                ...state,
                navigation : action.ref,
            }
        case SET_FIRST_RUN:
            return {
                ...state,
                first_run : action.value,
            }
        case SET_CONFIG:
            return {
                ...state,
                config : action.config,
            }
        case SET_LOG_DATA:
            return {
                ...state,
                log_inputs : action.log_inputs,
                log_result : action.log_result,
            }
    }
    return state;
}

// Exports Default
export default reducer;
