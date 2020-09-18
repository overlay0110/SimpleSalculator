import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform } from 'react-native';
import Loading from '../../import/Loading';
import {print, customAlert, postData} from '../../import/helpers';
import {scrollCheckAndroid} from '../../reducers/webViewReducers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const Base = props => {
    return (
        <View style={{flex:1}}>
            <Text>Base.js</Text>
        </View>
    );
}

function mapStateToProps (state) {
    // mapStateToProps여기에 로그 넣으면 속도 저하 발생
    return {
        state: state,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        scrollCheckAndroid: scrollCheckAndroid,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Base)
