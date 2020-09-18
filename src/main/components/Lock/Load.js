import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform } from 'react-native';
import Loading from '../../import/Loading';
import config from '../../import/config';
import {print, customAlert, postData, sha256, configUrl, actionAlert, getNow, _callConfig} from '../../import/helpers';
import {select, insert} from '../../import/fileDB';
import {setConfig} from '../../reducers/commonReducers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';

class Load extends Component{
    constructor(props){
        super(props);
        print(props);
        this.start();
        // this.didFocus = props.navigation.addListener("didFocus", payload => {
        //     this.start();
        // });
    }

    componentWillUnmount() {
        // this.didFocus.remove();
    }

    async start(){
        const info = await select('screenLock','*','rowid=?',[3]);

        let res = await _callConfig();
        let con = {};

        if(res.catch){
            const configInfo = await select('configLog order by rowid desc limit 1','json_configs');
            print('configInfo', configInfo);
            if(configInfo.length == 0){
                actionAlert(strings.internet_error, () => BackHandler.exitApp() );
            }
            else{
                con = JSON.parse(configInfo[0].json_configs);
            }
        }
        else{
            await insert('configLog',{json_configs : JSON.stringify(res.res), date : getNow()});
            con = res.res;
        }

        this.props.setConfig(con);

        if(con.PIN == false){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'WebView' })],
            });
            this.props.navigation.dispatch(resetAction);
            return false;
        }

        print('Load', info);

        print(sha256('None') , info[0].i);
        print(sha256('pin') , info[0].i);

        if(sha256('None') == info[0].i){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'WebView' })],
            });
            this.props.navigation.dispatch(resetAction);
        }
        else if(sha256('pin') == info[0].i){
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'LockAuth' })],
            });
            this.props.navigation.dispatch(resetAction);
        }
    }

    render(){
        print('Load props',this.props);
        return null;
        // return (
        //     <View style={{flex:1}}>
        //         <Text>Load.js</Text>
        //     </View>
        // );
    }
}

function mapStateToProps (state) {
    // mapStateToProps여기에 로그 넣으면 속도 저하 발생
    return {
        state: state,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        setConfig: setConfig,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Load)
