import {print} from '../import/helpers';
import Geolocation from '@react-native-community/geolocation';
import {loadingStart, loadingStop} from './commonReducers';
import {getUrlDatas} from '../import/helpers';
import { NavigationActions } from 'react-navigation';
import {Dimensions} from 'react-native';

// Default State
const initialState = {
    refreshing : false, // 새로고침 컨트롤 표시 여부
    enablePTR : true, // 안드로이드 스크롤 먹통 문제 때문에 추가
    current_url : '', // 현재 url
    scrollViewHeight : Dimensions.get('window').height,
    webview : null,
};

// Actions
export const SCROLL_CHECK_ANDROID = "SCROLL_CHECK_ANDROID";
export const REFRESH = "REFRESH";
export const URL_CHANGE = "URL_CHANGE";
export const HEIGHT_SET = "HEIGHT_SET";
export const STATE_RESET = "STATE_RESET";
export const SET_WEBVIEW = "SET_WEBVIEW";

// Action Functions
export function scrollCheckAndroid(e){
    return {
        type: SCROLL_CHECK_ANDROID,
        enablePTR: e.nativeEvent.data == 0
    };
}

export function refresh(){
    return (dispatch) => {
        dispatch(loadingStop());
        return {
            type: REFRESH,
            refreshing: false,
        }
    };
}

export function urlChange(webViewState){
    return {
        type : URL_CHANGE,
        current_url : webViewState.url,
    }
}

export function heightSet(height){
    return {
        type : HEIGHT_SET,
        scrollViewHeight : height
    }
}

export function stateReset(){
    return {
        type : STATE_RESET,
    }
}

export function setWebview(ref){
    return {
        type : SET_WEBVIEW,
        ref : ref,
    }
}

// Reducer
function reducer(state = initialState, action) {
    // print('ACTION', action.type);
    switch (action.type) {
        case SCROLL_CHECK_ANDROID:
            return {
                ...state,
                count: state.count + 1,
                enablePTR : action.enablePTR,
            }
        case REFRESH:
            return {
                ...state,
                refreshing: false,
            }
        case URL_CHANGE:
            return {
                ...state,
                current_url : action.current_url,
            }
        case HEIGHT_SET:
            return {
                ...state,
                scrollViewHeight : action.scrollViewHeight
            }
        case STATE_RESET:
            return {
                refreshing : false,
                enablePTR : true,
                current_url : '',
                scrollViewHeight : 0,
            }
        case SET_WEBVIEW:
            return {
                ...state,
                webview : action.ref,
            }
    }
    return state;
}

// Exports Default
export default reducer;
