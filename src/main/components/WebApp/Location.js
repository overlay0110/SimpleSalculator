import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform } from 'react-native';
import Loading from '../../import/Loading';
import {print, customAlert, postData, getUrlDatas} from '../../import/helpers';
import {scrollCheckAndroid} from '../../reducers/webViewReducers';
import {loadingStart, loadingStop, setResponseUrl} from '../../reducers/commonReducers';
import { getLocation } from '../../reducers/locationReducers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Location extends Component {
    constructor(props){
        super(props);
        this.didFocus = props.navigation.addListener("didFocus", payload => {
            props.getLocation(true);
        });
    }

    componentWillUnmount() {
        this.didFocus.remove();
    }

    render(){
        return <Loading loading={true} />;

        // return (
        //     <View style={{flex:1}}>
        //         <Text>Location.js</Text>
        //     </View>
        // );
    }

}


function mapStateToProps (state) {
    // mapStateToProps여기에 로그 넣으면 속도 저하 발생
    return {
        url : state.webViewReducers.current_url,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        scrollCheckAndroid: scrollCheckAndroid,
        loadingStart : loadingStart,
        loadingStop : loadingStop,
        setResponseUrl : setResponseUrl,
        getLocation : getLocation,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Location)
