import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform } from 'react-native';
import Loading from '../../import/Loading';
import {print, customAlert, postData} from '../../import/helpers';
import {recievePin, setPinScreen} from '../../reducers/pinAuthReducers';
import {setNavigation} from '../../reducers/commonReducers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import strings from '../../assets/locale';

import { PinScreen } from 'react-native-awesome-pin';

class LockAuth extends Component {
    constructor(props){
        super(props);
        var pinScreen = null;
        this.didFocus = props.navigation.addListener("didFocus", payload => {
            props.setNavigation(this.props.navigation);
            props.setPinScreen(this.pinScreen);
        });
    }

    componentWillUnmount() {
        this.didFocus.remove();
    }

    render() {
        const props = this.props;
        const {pinNum, pinScreenMsg} = props.state.pinAuthReducers;
        const {config} = props.state.commonReducers;

        const pinSet = config.PIN_SET;
        const numberOfPins = pinSet.numberOfPins;
        const backGroundColor = pinSet.backGroundColor;

        return (
            <PinScreen
                onRef={ ref => { this.pinScreen = ref; props.setPinScreen(ref); } }
                tagline={pinScreenMsg}
                headerBackgroundColor={backGroundColor}
                safeAreaViewHeaderDefaultStyle={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    marginTop: 0,
                }}
                pin={pinNum}
                numberOfPins={numberOfPins}
                containerStyle={{ backgroundColor: backGroundColor }}
                keyDown={ props.recievePin }
            />
        );
    }
}

function mapStateToProps (state) {
    return {
        state: state,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        recievePin: recievePin,
        setPinScreen : setPinScreen,
        setNavigation : setNavigation,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LockAuth)
