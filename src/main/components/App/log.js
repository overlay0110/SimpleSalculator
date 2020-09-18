import React, {Component} from 'react';
import { View, Text, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import Loading from '../../import/Loading';
import CustomHeader from '../../import/header';
import {print, customAlert, postData, actionAlert2} from '../../import/helpers';
import {setLogData} from '../../reducers/commonReducers';
import {select, del} from '../../import/fileDB'
import SideBar from '../../import/SideBar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Left, Right, Icon, Body, Title, Button } from 'native-base';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

class Base extends Component {
    constructor(props){
        super(props);
        this.state = {
            datas : [],
        }
        this.start();
    }

    componentDidMount(){
    }

    componentWillUnmount() {
    }

    async start(){
        let datas = await select('log','*','1 order by rowid desc');
        this.setState({
            datas : datas,
        });
    }

    del_datas(){
        actionAlert2('Are you sure you want to delete all?', () => {del('log'); this.start();});
    }

    render(){
        let {datas} = this.state;
        return (
            <View style={{flex:1, backgroundColor : 'gray'}}>
                <CustomHeader
                    custom
                    left={(
                        <Button transparent onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back' />
                        </Button>
                    )}
                    center={(
                        <Title>Calculation History</Title>
                    )}
                    right={(
                        <Button transparent onPress={this.del_datas.bind(this)}>
                          <Icon type="FontAwesome5" name='trash' style={{color:'#ffffff'}} />
                        </Button>
                    )}
                />

                <ScrollView>
                    {datas.map((item, i) =>
                        <TouchableOpacity style={{width:'100%',paddingLeft:'5%',paddingRight:'5%',paddingTop:'2%',paddingBottom:'2%'}} onPress={() => {this.props.setLogData(JSON.parse(item.inputs), item.result); this.props.navigation.navigate('Main');}}>
                            <View style={{width:'100%', borderBottomWidth:1, borderColor:'#fff', padding : 10, alignItems : 'flex-end'}}>
                                <Text style={{fontSize : moderateScale(20), color : '#fff'}}>{item.date}</Text>
                                <Text style={{fontSize : moderateScale(30), color : '#fff'}}>{JSON.parse(item.inputs).join(' ').replace(/\*/g,'x').replace(/%/g,'mod').replace(/\//g,'÷')}</Text>
                                <Text style={{fontSize : moderateScale(50), color : '#fff'}}>{item.result}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    buttonLabel: {
        borderWidth: 1,
        borderColor: "#d6d7da",
        padding: moderateScale(10),
        paddingTop : moderateScale(5),
        paddingBottom : moderateScale(5),
        textAlign: "center",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        marginRight : moderateScale(10),
        height : scale(80),
    },
});


function mapStateToProps (state) {
    // mapStateToProps여기에 로그 넣으면 속도 저하 발생
    return {
        state: state,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        setLogData: setLogData,
        // scrollCheckAndroid: scrollCheckAndroid,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Base)
