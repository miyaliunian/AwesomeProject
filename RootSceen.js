/**
 * Created by wufei on 2018/6/27.
 */
import React, {Component} from 'react';
import theme from './src/common/theme'

import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
//导航布局
import {createStackNavigator, createBottomTabNavigator, createSwitchNavigator} from 'react-navigation'
//切换动画
import CardStackStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';

import Icon from 'react-native-vector-icons/Ionicons'

//业务导入

import  LoadingScreen from './src/screens/LoadingScreen'
// 登录-注册-完善个人-忘记密码
import LoginScreen from './src/screens/signIn/LoginScreen'
import ImpProfileInfo from './src/screens/signIn/impProInfo/ImpProfileInfo'
import SignUpScreen from './src/screens/signIn/signUP/SignUpScreen'
import SetPwdScreen from './src/screens/signIn/setPwd/SetPwdScreen'
// 首页
import  HomeScreen from './src/screens/home/HomeScreen'
// 管理
import  ManagerScreen from './src/screens/manage/ManagerScreen'
//我的
import  ProfileScreen from './src/screens/profile/ProfileScreen'
import  ProfileInfoScreen from './src/screens/profile/profileInfo/ProfileInfoScreen'
import  SupplierInfoScreen from './src/screens/profile/supplier/SupplierInfoScreen'


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
                        borderBottomWidth: 0,
                        borderBottomColor: 'transparent'
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
                        borderBottomWidth: 0,
                        borderBottomColor: 'transparent'
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
                },
                ProfileInfoScreen: {
                    screen: ProfileInfoScreen
                },
                SupplierInfoScreen: {
                    screen: SupplierInfoScreen
                },
            }, {
                navigationOptions: {
                    headerStyle: {
                        backgroundColor: theme.navColor,
                        borderBottomWidth: 0,
                        borderBottomColor: 'transparent',
                    },
                    headerTitleStyle: {
                        color: 'white'
                    },
                    headerBackImage: (tintColor, title) => (
                        <SimpleLineIcons
                            name={'arrow-left'}
                            size={20}
                            color={'white'}/>
                    ),
                    headerBackTitle: '返回',
                    headerBackTitleStyle: {
                        color: 'white'
                    },
                    headerForceInset: {left: 7}
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
        mode: 'card',// 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen',
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
            screenInterpolator: CardStackStyleInterpolator.forHorizontal //水平动画
        })
    }
);


const ImpAuthStack = createStackNavigator(
    {
        //完善资料:(注册之后强制跳转到此页面)
        index: {
            screen: ImpProfileInfo,
        },
    },
    {
        navigationOptions: {
            headerStyle: {
                backgroundColor: theme.navColor,
                borderBottomWidth: 0,
                borderBottomColor: 'transparent',
            },
            headerTitleStyle: {
                color: 'white'
            },
            headerBackImage: (tintColor, title) => (
                <SimpleLineIcons
                    name={'arrow-left'}
                    size={20}
                    color={'white'}/>
            ),
            headerBackTitle: '返回',
            headerBackTitleStyle: {
                color: 'white'
            },
            headerForceInset: {left: 7}
        }
    }
)

const AuthStackConfigs = {
    initialRouteName: 'Login',
    navigationOptions: {
        headerStyle: {},
        alignSelf: 'center',
        // headerTitleStyle: {
        //     fontWeight: 'bold',
        //     color: 'white'
        // },
        header: null,
        gesturesEnabled: true,
        headerMode: 'screen'
    },
    transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal
    }),
};

const AuthStack = createStackNavigator(
    {
        // 登录
        Login: {
            screen: LoginScreen,
        },
        // 注册
        SignUp: {
            screen: SignUpScreen,
        },
        // 设置密码
        setPwd: {
            screen: SetPwdScreen,
        },
    },
    AuthStackConfigs
)

const AuthLoading = createStackNavigator(
    {
        Loading: {
            screen: LoadingScreen,
        },
    },
    {
        navigationOptions: {
            header: null,
        },
    }
)

const SwitchNavigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        Auth: AuthStack,
        ImpAuth: ImpAuthStack,
        App: AppStack,

    },
    {
        initialRouteName: 'ImpAuth',
    }
)

