import React from "react";
import { Platform, View, StatusBar, Image, Text } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { isIphoneX, getBottomSpace } from "react-native-iphone-x-helper";
import config from './config';
import { Header, Left, Right, Icon, Body, Title, Button } from 'native-base';

// 아이폰 상단바 높이 설정
const Height = () => {
    if (isIphoneX()) {
        return getBottomSpace();
    } else {
        return getStatusBarHeight(true);
    }
};

const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? Height() : 0;

// 상단바 폼
function PlatformSelectStatusBar(props) {
    let bar_style = "light-content";

    if(props.dark){
        bar_style = "dark-content";
    }

    if(Platform.OS === "android"){
        return (
            <StatusBar
                backgroundColor={config.STATUS_BAR_COLOR}
                barStyle={bar_style}
              />
        );
    }
    else if(Platform.OS === "ios"){
        return (
            <View style={{
                width: "100%",
                height: STATUS_BAR_HEIGHT,
                backgroundColor: config.STATUS_BAR_COLOR
            }}>
                <StatusBar
                    barStyle={bar_style}
                />
            </View>
        );
    }
}

export default class LayoutHeader extends React.Component {
    render() {
        const {left, center, right, custom} = this.props
        let dark = false;
        let cus_value = false;

        if(custom != undefined || custom != null){
            cus_value = custom;
        }

        if(!cus_value){
            return (
                <PlatformSelectStatusBar dark={dark} />
            );
        }
        else{
            return (
                <Header androidStatusBarColor='gray' style={{backgroundColor : 'gray'}}>
                  <Left>
                    {left}
                  </Left>
                  <Body>
                    {center}
                  </Body>
                  <Right>
                    {right}
                  </Right>
                </Header>
            );
        }



        // return (
        //     <Header androidStatusBarColor='gray' style={{backgroundColor : 'gray'}}>
        //       <Left>
        //         <Button transparent>
        //           <Icon name='arrow-back' />
        //         </Button>
        //       </Left>
        //       <Body>
        //         <Title>Header</Title>
        //       </Body>
        //       <Right>
        //         <Button transparent>
        //           <Icon name='menu' />
        //         </Button>
        //       </Right>
        //     </Header>
        // );
    }
}
