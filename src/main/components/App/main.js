import React, {Component} from 'react';
import { View, Text, BackHandler, ToastAndroid, Dimensions, ScrollView, RefreshControl, Platform, TouchableOpacity, StyleSheet } from 'react-native';
import Loading from '../../import/Loading';
import CustomHeader from '../../import/header';
import {print, customAlert, postData, transDate} from '../../import/helpers';
import {setLogData} from '../../reducers/commonReducers';
import {insert} from '../../import/fileDB';
import SideBar from '../../import/SideBar';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Header, Left, Right, Icon, Body, Title, Button } from 'native-base';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const KEY_LIST = [
    ['c','$PASS','$MOD','$BACK'],
    ['7','8','9','/'],
    ['4','5','6','*'],
    ['1','2','3','-'],
    ['0','=','$PASS','+'],
];

class Base extends Component {
    constructor(props){
        super(props);
        this.state = {
            key_list : KEY_LIST,
            inputs : [],
            input : '',
            result : '',
            result_success : false,
        }
    }

    componentWillUnmount() {
    }

    insertText = value => () => {
        let {inputs, result, result_success} = this.state;
        let regex= /[^0-9]/g;
        var str_reg =  /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
        let last_value = '';

        if(inputs[inputs.length -1] != undefined){
            last_value = inputs[inputs.length -1];
        }

        if(value == 'c'){
            this.setState({
                inputs : [],
                input : '',
                result : '',
                result_success : false,
            });
            return false;
        }

        if(value == '$BACK'){
            inputs.pop();
            let r_value = '';

            try {
                r_value = eval(inputs.join(''));
                if(r_value == undefined){
                    r_value = '';
                }
                this.setState({
                    input : inputs.join(' ').replace(/\*/g,'x').replace(/%/g,'mod').replace(/\//g,'÷'),
                    result : r_value,
                });
            } catch (err) {
                this.setState({
                    input : inputs.join(' ').replace(/\*/g,'x').replace(/%/g,'mod').replace(/\//g,'÷'),
                });
            }
            return false;
        }

        if(result == '' && value.match(regex) != null){
            return false;
        }

        if(last_value.match(str_reg) != null && last_value.trim().length != 0 && value.match(str_reg) != null){
            return false;
        }

        if(result != '' && result_success == true && value.match(regex) == null){
            let setReset = [];
            setReset.push(value)
            this.setState({
                inputs : setReset,
                input : setReset.join(' ').replace(/\*/g,'x').replace(/%/g,'mod').replace(/\//g,'÷'),
                result : value,
                result_success : false,
            });
            return false;
        }
        else{
            this.setState({
                result_success : false,
            });
        }

        if(value == '$MOD'){
            inputs.push('%');
            this.setState({
                input : inputs.join(' ').replace(/\*/g,'x').replace(/%/g,'mod').replace(/\//g,'÷'),
            });
            return false;
        }

        if(value == '='){
            let result = eval(inputs.join(''));

            insert('log',{inputs : JSON.stringify(inputs), result : result, date : transDate() });

            this.setState({
                input : inputs.join(' ').replace(/\*/g,'x').replace(/%/g,'mod').replace(/\//g,'÷'),
                result : result,
                result_success : true,
            });
            return false;
        }

        inputs.push(value);

        let in_result = value.match(regex) == null ? this.state.result+value : this.state.result;

        if(last_value.match(str_reg) != null && last_value.trim().length != 0 && value.match(regex) == null){
            in_result = value;
        }

        this.setState({
            input : inputs.join(' ').replace(/\*/g,'x').replace(/%/g,'mod').replace(/\//g,'÷'),
            result : in_result,
        });
    }

    render(){
        let {key_list} = this.state;

        if(this.props.log_inputs.length != 0){
            this.setState({
                inputs : this.props.log_inputs,
                result : this.props.log_result,
                input : this.props.log_inputs.length != 0 ? this.props.log_inputs.join(' ').replace(/\*/g,'x').replace(/%/g,'mod').replace(/\//g,'÷') : '',
            });
            this.props.setLogData([],'');
        }

        return (
            <View style={{flex:1, backgroundColor : 'gray'}}>
                <CustomHeader
                    custom
                    center={(
                        <Title>Simple Salculator</Title>
                    )}
                    right={(
                        <Button transparent onPress={() => this.props.navigation.navigate('Log')}>
                          <Icon type="FontAwesome5" name='list' style={{color:'#ffffff'}} />
                        </Button>
                    )}
                />

                <ScrollView>

                <View style={{ flex: 1, alignItems : 'flex-end'}}>
                    <View style={{height : verticalScale(10)}} />
                    <ScrollView horizontal={true} >
                        <Text style={{color : '#fff', fontSize : moderateScale(15), marginRight : scale(55) }}>{this.state.input}</Text>
                    </ScrollView>

                    <ScrollView horizontal={true} >
                        <Text style={{color : '#fff', fontSize : moderateScale(30), marginRight : scale(55)}}>{this.state.result}</Text>
                    </ScrollView>
                </View>
                <View style={{backgroundColor: 'gray'}}>
                    <View style={{height : verticalScale(10)}} />

                    {key_list.map((items, i) =>
                        <View>
                            <View style={{flexDirection : "row", alignItems : 'center', justifyContent : 'center'}}>
                                {items.map((item) => {
                                    if(item == '$PASS'){
                                        return null;
                                    }

                                    if(item == '$MOD'){
                                        return (
                                            <TouchableOpacity onPress={this.insertText(item)}>
                                                <View style={[styles.buttonLabel,{width : scale(58)}]}>
                                                    <Text style={{fontSize : moderateScale(20),fontWeight: 'bold', color : '#fff'}}>{'mod'}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }

                                    if(item == '$BACK'){
                                        return (
                                            <TouchableOpacity onPress={this.insertText(item)}>
                                                <View style={[styles.buttonLabel,{width : scale(58)}]}>
                                                    <Icon type="FontAwesome5" name="backspace" style={{color:'#fff',fontSize : moderateScale(30),fontWeight: 'bold',}} />
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }

                                    if(item == '/'){
                                        return (
                                            <TouchableOpacity onPress={this.insertText(item)}>
                                                <View style={[styles.buttonLabel,{width : scale(58)}]}>
                                                    <Icon type="FontAwesome5" name="divide" style={{color:'#fff',fontSize : moderateScale(30),fontWeight: 'bold',}} />
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }

                                    if(item == '*'){
                                        return (
                                            <TouchableOpacity onPress={this.insertText(item)}>
                                                <View style={[styles.buttonLabel,{width : scale(58)}]}>
                                                    <Text style={{fontSize : moderateScale(50),fontWeight: 'bold',color : '#fff'}}>{'X'}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }

                                    if(item == 'c'){
                                        return (
                                            <TouchableOpacity onPress={this.insertText(item)}>
                                                <View style={[styles.buttonLabel,{width : scale(125)}]}>
                                                    <Text style={{fontSize : moderateScale(50),fontWeight: 'bold',color : '#fff'}}>{item}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }

                                    if(item == '='){
                                        return (
                                            <TouchableOpacity onPress={this.insertText(item)}>
                                                <View style={[styles.buttonLabel,{width : scale(125)}]}>
                                                    <Text style={{fontSize : moderateScale(50),fontWeight: 'bold',color : '#fff'}}>{item}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    }

                                    return (
                                        <TouchableOpacity onPress={this.insertText(item)}>
                                            <View style={[styles.buttonLabel,{width : scale(58)}]}>
                                                <Text style={{fontSize : moderateScale(50),fontWeight: 'bold',color : '#fff'}}>{item}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                            <View style={{height : verticalScale(10)}} />
                        </View>
                    )}
                </View>
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
        log_inputs : state.commonReducers.log_inputs,
        log_result : state.commonReducers.log_result,
    }
}

function mapDispatchToProps (dispatch) {
    return bindActionCreators({
        setLogData: setLogData,
        // scrollCheckAndroid: scrollCheckAndroid,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Base)
