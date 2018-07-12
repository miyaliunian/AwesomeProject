/**
 * Created by wufei on 2018/6/27.
 */
import React, {Component} from 'react';
import theme from './src/common/theme'

//导航布局
import {createStackNavigator, createBottomTabNavigator, createSwitchNavigator} from 'react-navigation'
//切换动画
import CardStackStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';

import Icon from 'react-native-vector-icons/Ionicons'

//业务导入

import  LoadingScreen from './src/screens/LoadingScreen'
// 登录-注册-忘记密码
import LoginScreen from './src/screens/signIn/LoginScreen'
import SignUpScreen from './src/screens/signIn/signUP/SignUpScreen'
import SetPwdScreen from './src/screens/signIn/setPwd/SetPwdScreen'
// 首页
import  HomeScreen from './src/screens/home/HomeScreen'
// 管理
import  ManagerScreen from './src/screens/manage/ManagerScreen'
//我的
import  ProfileScreen from './src/screens/profile/ProfileScreen'


export default class App extends Component {

    render() {
        return (
            <SwitchNavigator/>
        );
    }
}


const TabStack = createBottomTabNavigator(
    {
        home: {
            screen: createStackNavigator({
                index: {
                    screen: HomeScreen
                },
            }, {
                navigationOptions: {
                    headerStyle: {
                        backgroundColor: theme.navColor,
                    }
                }

            }),
            navigationOptions: {
                tabBarLabel: '首页',
                tabBarIcon: ({focused, tintColor}) => (
                    <Icon name={`ios-home${focused ? '' : '-outline'}`} size={25} color={tintColor}/>
                )
            }
        },
        manage: {
            screen: createStackNavigator({
                index: {
                    screen: ManagerScreen
                }
            }, {
                navigationOptions: {
                    headerStyle: {
                        backgroundColor: theme.navColor,

                    }
                }

            }),
            navigationOptions: {
                tabBarLabel: '管理',
                tabBarIcon: ({focused, tintColor}) => (
                    <Icon name={`ios-apps${focused ? '' : '-outline'}`} size={25} color={tintColor}/>
                )
            }
        },
        profile: {
            screen: createStackNavigator({
                index: {
                    screen: ProfileScreen
                }
            }, {
                navigationOptions: {
                    headerStyle: {
                        backgroundColor: theme.navColor,
                        borderBottomWidth:0,
                        borderBottomColor:'transparent'
                    }
                }

            }),
            navigationOptions: {
                tabBarLabel: '我的',
                tabBarIcon: ({focused, tintColor}) => (
                    <Icon name={`ios-people${focused ? '' : '-outline'}`} size={25} color={tintColor}/>
                )
            }
        },
    },
    {

        initialRouteName: 'home',
        order: ['home', 'manage', 'profile'],
    }
)

const AppStack = createStackNavigator(
    {
        TabStack: {
            screen: TabStack,
        },

    },
    {
        mode: 'card',// 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'none',// 导航栏的显示模式, screen: 有渐变透明效果, float: 无透明效果, none: 隐藏导航栏
        navigationOptions: {
            gesturesEnabled: true,
        },
        transitionConfig: () => ({ //切换动画
            screenInterpolator: CardStackStyleInterpolator.forFade //水平动画
        })
    }
);

const AuthStack = createStackNavigator(
    {
        Login: {
            screen: LoginScreen,
        },
    },
    {
        initialRouteName: 'Login',
        navigationOptions: {
            gesturesEnabled: false,
            headerStyle: {
                backgroundColor: 'red',
            },
            header: null
        }
    }
)


const AuthLoading = createStackNavigator(
    {
        Loading: {
            screen: LoadingScreen,
        },
        SignUp: {
            screen: SignUpScreen,
        },
        setPwd: {
            screen: SetPwdScreen,
        },
    },
    {
        initialRouteName: 'SignUp',
        navigationOptions: {
            gesturesEnabled: true,
            headerStyle: {

            },
            header: null
        }
    }
)

const SwitchNavigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        Auth: AuthStack,
        App: AppStack,

    },
    {
        initialRouteName: 'Auth',
    }
)

