import React, {Component} from "react";
import { AppRegistry, Image, ImageBackground, StatusBar, View } from "react-native";
import { Container, Content, Text, List, ListItem } from "native-base";

const routes = ["계산 기록",];
const option = {
    "계산 기록": "Log",
}
export default class SideBar extends Component {
  render() {

    return (
      <Container style={{backgroundColor: "#132735",}}>
        <Content>
        {{/*
          <View
            style={{
              height: 80,
              alignSelf: "stretch",
              justifyContent: "center",
              alignItems: "flex-start",
              marginLeft:'5%',
            }}>
            <Image
              square
              style={{ height: 40, width: "60%", }}
              source={require('../assets/img/walletintro_logo.png')}
            />
          </View>
          <View style={{borderBottomWidth:1,borderColor:'#ffffff', width: "80%", marginLeft:'10%',marginRight:'10%',}} />
          */}}
          <List
            dataArray={routes}
            renderRow={data => {
              return (
                <ListItem
                  button
                  style={{borderBottomWidth:0}}
                  onPress={() => this.props.navigation.navigate(option[data])}>
                  <Text style={{color:'#ffffff'}}>{data}</Text>
                </ListItem>
              );
            }}
          />
        </Content>
      </Container>
    );
  }
}
