import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform } from 'react-native';
import AndroidWebView from 'react-native-webview-file-upload-android';
import WKWebView from 'react-native-wkwebview-reborn';
import Loading from '../../import/Loading';
import {print, customAlert, postData, getUrlDatas} from '../../import/helpers';
import {scrollCheckAndroid, refresh, urlChange, heightSet, stateReset, setWebview} from '../../reducers/webViewReducers';
import {loadingStart, loadingStop, setResponseUrl} from '../../reducers/commonReducers';
import { getLocation } from '../../reducers/locationReducers';
import { setPinState } from '../../reducers/pinAuthReducers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';

function start(props){
    if(props.latitude == null && props.location_err_msg.trim().length == 0 && props.config.LOCATION == true){
        props.getLocation();
    }
}

class WebView extends Component{
    constructor(props){
        super(props);
        var webview = null;
    }

    urlChange(webViewState){
        print('this.urlChange', webViewState);
        let url = webViewState.url;
        const config = this.props.config;

        if(url.match('app_location') == 'app_location' && config.LOCATION == true){
            let url_datas = getUrlDatas(url, 'app_location');
            this.props.setResponseUrl(url_datas['response_url']);
            this.props.getLocation();
            this.webview.goBack();
            return false;
        }

        if(url.match('app_qrscan') == 'app_qrscan' && config.QRSCAN == true){
            let url_datas = getUrlDatas(url, 'app_qrscan');
            this.props.setResponseUrl(url_datas['response_url']);
            this.webview.goBack();

            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'QRscan' }),
                ],
            });
            this.props.navigation.dispatch(resetAction);

            return false;
        }

        if(url.match('app_pin_auth') == 'app_pin_auth' && config.PIN == true){
            let url_datas = getUrlDatas(url, 'app_pin_auth');
            this.props.setResponseUrl(url_datas['response_url']);
            this.webview.goBack();

            this.props.setPinState('auth');

            const resetAction = StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({ routeName: 'LockAuth' }),
                ],
            });
            this.props.navigation.dispatch(resetAction);

            return false;
        }

        if(url.match('app_pin_reset') == 'app_pin_reset' && config.PIN == true){
            this.webview.goBack();
            this.props.setPinState('reset');

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'LockAuth' })],
            });
            this.props.navigation.dispatch(resetAction);

            return false;
        }

        this.props.urlChange(webViewState);
    }

    _renderError(){
         // print('renderError'); customAlert('인터넷 에러');
    }

    render(){
        let props = this.props;
        print('WebView props', props);

        start(props);
        let run_url = props.config.URL;

        print('WebView', run_url, props.response_success, props.response_url);
        if(props.response_url != null){
            run_url = props.response_url;
        }

        print('WebView', run_url);

        if(props.loading == true){
            return <Loading loading={true} />
        }

        let send_data = {};

        if(props.config.LOCATION == true){
            send_data['latitude'] = props.latitude;
            send_data['longitude'] = props.longitude;
            send_data['location_err_msg'] = props.location_err_msg;
            send_data['location_error'] = props.location_error;
        }

        if(props.config.QRSCAN == true){
            send_data['qrscan_data'] = props.qrscan_data;
            send_data['qrscan_err_msg'] = props.qrscan_err_msg;
            send_data['qrscan_error'] = props.qrscan_error;
        }

        let webViewSet = {
            javaScriptEnabled : true,
            domStorageEnabled : true,
            source : { uri: run_url + '?' + postData(send_data), method:'GET' },
            ref : r => {this.webview = r, props.setWebview(r)},
            // renderLoading : () => <Loading loading={true} />,
            startInLoadingState : true,
            style : {width:Dimensions.get('window').width, height:props.scrollViewHeight},
            renderError : this._renderError,
            onNavigationStateChange : this.urlChange.bind(this),
            // onLoadStart : () => {print('onLoadStart'); props.loadingStart();},
            // onLoad : () => {print('onLoad'); props.loadingStop();},
            // onLoadEnd : () => {print('onLoadEnd')}
        }

        if(Platform.OS == 'android'){
            webViewSet['onMessage'] = props.scrollCheckAndroid;
            webViewSet['enableNavigate'] = false;
            webViewSet['injectedJavaScript'] = "window.onscroll = function() { window.postMessage(document.documentElement.scrollTop||document.body.scrollTop)}";
        }

        if(Platform.OS == 'ios'){
            webViewSet['allowsBackForwardNavigationGestures'] = true;
        }

        print('webViewSet', webViewSet);


        return (
            <View style={{flex:1}}>
                <ScrollView
                    onLayout={(ev) => props.heightSet(ev.nativeEvent.layout.height)}
                    refreshControl={
                        <RefreshControl
                            refreshing={props.refreshing}
                            onRefresh={() => {this.webview && this.webview.reload(); props.refresh()} }
                            enabled={(Platform.OS === "ios")? true : props.enablePTR }
                        />
                    }
                >
                {Platform.select({
                    android:  () => <AndroidWebView
                                        {...webViewSet}
                                    />,
                    ios:      () => <WKWebView
                                        {...webViewSet}
                                    />
                })()}
                </ScrollView>
            </View>
        );
    }
}

function mapStateToProps (state) {
    // mapStateToProps여기에 로그 넣으면 속도 저하 발생
    return {
        refreshing: state.webViewReducers.refreshing,
        enablePTR : state.webViewReducers.enablePTR,
        current_url : state.webViewReducers.current_url,
        webview : state.webViewReducers.webview,
        scrollViewHeight : state.webViewReducers.scrollViewHeight,
        loading : state.commonReducers.loading,
        response_url : state.commonReducers.response_url,
        response_success : state.commonReducers.response_success,
        config : state.commonReducers.config,
        latitude : state.locationReducers.latitude,
        longitude : state.locationReducers.longitude,
        location_error : state.locationReducers.location_error,
        location_err_msg : state.locationReducers.location_err_msg,
        qrscan_data : state.qrscanReducers.qrscan_data,
        qrscan_err_msg : state.qrscanReducers.qrscan_err_msg,
        qrscan_error : state.qrscanReducers.qrscan_error,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        scrollCheckAndroid: scrollCheckAndroid,
        urlChange: urlChange,
        refresh : refresh,
        heightSet : heightSet,
        loadingStart : loadingStart,
        loadingStop : loadingStop,
        getLocation : getLocation,
        stateReset : stateReset,
        setResponseUrl : setResponseUrl,
        setWebview : setWebview,
        setPinState : setPinState,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WebView)
