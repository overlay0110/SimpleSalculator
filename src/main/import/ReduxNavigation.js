import React from "react";
import { BackHandler, ToastAndroid } from "react-native";
import { bindActionCreators } from 'redux';
import { connect } from "react-redux";
import { NavigationActions, StackActions } from "react-navigation";
import {print} from './helpers';
import strings from '../assets/locale';
import {setResponseUrl} from '../reducers/commonReducers';

import { App } from "../index";

class ReduxNavigation extends React.Component {
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
    }

    componentWillUnmount() {
        this.exitApp = false;
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
    }

    _exitApp(props = null){
        const {dispatch} = props;
        if (this.exitApp == undefined || !this.exitApp) {
            ToastAndroid.show(strings.finish_mess, ToastAndroid.SHORT);
            this.exitApp = true;
            this.timeout = setTimeout(
                () => {
                    this.exitApp = false;
                },
                2000    // 2초
            );
        } else {
            // dispatch(NavigationActions.navigate({ routeName: 'Load' }));
            clearTimeout(this.timeout);
            BackHandler.exitApp();  // 앱 종료
        }
    }

    _goWebView(current_url, dispatch){
        dispatch(setResponseUrl(current_url));
        dispatch(NavigationActions.navigate({ routeName: 'WebView' }));
    }

    onBackPress = () => {
        const { nav, dispatch, config } = this.props;
        const end_page = config.END_PAGE;

        if(nav.routes[nav.index].routeName == 'Main'){
            this._exitApp(this.props);
            return true;
        }

        if (nav.index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    };

    render() {
        const { nav, dispatch } = this.props;

        return <App state={nav} dispatch={dispatch} />;
    }
}

const mapStateToProps = state => ({
    // mapStateToProps여기에 로그 넣으면 속도 저하 발생
    nav: state.nav,
    config : state.commonReducers.config,
});

export default connect(mapStateToProps)(ReduxNavigation);
