import React, {Component} from 'react';
import { View, Text, Button, BackHandler, ToastAndroid } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

import {Provider, connect} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk'

import Reducers from './reducers';
import ReduxNavigation from "./import/ReduxNavigation";
import SideBar from "./import/SideBar";
import { Screen } from "./components";
import LayoutHeader from "./import/header";
import LayoutFooter from "./import/footer";

import {
    createReduxContainer,
    createReactNavigationReduxMiddleware,
    createNavigationReducer,
} from 'react-navigation-redux-helpers';

const AppNavigator = createStackNavigator(
    {
        ...Screen
    },
    {
        initialRouteName: 'Main',
        // initialRouteParams: {},
        headerMode: 'none',
    }
);

const navReducer = createNavigationReducer(AppNavigator);
const appReducer = combineReducers({
    nav: navReducer,
    ...Reducers
});

const middleware = createReactNavigationReduxMiddleware(
    state => state.nav
);

const Navigator = createReduxContainer(AppNavigator);
const mapStateToProps = (state) => ({
    state: state.nav,
});
export const App = connect(mapStateToProps)(Navigator);

const store = createStore(appReducer, applyMiddleware(middleware, thunk));

export default class Root extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <LayoutHeader />
                <ReduxNavigation />
                <LayoutFooter />
            </Provider>
        );
    }
}
