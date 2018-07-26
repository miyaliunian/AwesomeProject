/**
 * Created by wufei on 2018/6/27.
 */
import React, {Component} from 'react';
import theme from './src/common/theme'
import { View, Text, TabBarIOS } from 'react-native';
import TabBarItem from './src/components/TabBarItem'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
//导航布局
import {createStackNavigator, createBottomTabNavigator, createSwitchNavigator} from 'react-navigation'
//切换动画
import CardStackStyleInterpolator from 'react-navigation/src/views/StackView/StackViewStyleInterpolator';

import Icon from 'react-native-vector-icons/Ionicons'

//业务导入

import  LoadingScreen from './src/screens/LoadingScreen'
// 登录-注册-完善个人-忘记密码
import SignInScreen from './src/screens/signIn/SignInScreen'
import ImpProfileInfo from './src/screens/signIn/impProInfo/ImpProfileInfo'
import SignUpScreen from './src/screens/signIn/signUP/SignUpScreen'
import SetPwdScreen from './src/screens/signIn/setPwd/SetPwdScreen'
// 首页
import  HomeScreen from './src/screens/home/HomeScreen'
// 管理
import  ManagerScreen from './src/screens/manage/ManagerScreen'
//我的
import  ProfileScreen from './src/screens/profile/ProfileScreen'
import  MessageInfoScreen from './src/screens/profile/messageInfo/MessageInfoScreen'
import  ProfileInfoScreen from './src/screens/profile/profileInfo/ProfileInfoScreen'
import  SupplierInfoScreen from './src/screens/profile/supplier/SupplierInfoScreen'
import  CompanyInfoScreen from './src/screens/profile/companyInfo/CompanyInfoScreen'
import  TenantsInfoScreen from './src/screens/profile/tenants/TenantsInfoScreen'

export default class App extends Component {

    render() {
        return (
            <SwitchNavigator/>
        );
    }
}


/**
 * 底部tab  拆解
 * @param
 */

const home = createStackNavigator(
    {
        index: {
            screen: HomeScreen
        }
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
            headerForceInset: {left: 7,right:7},
        }
    }
);

const manager = createStackNavigator(
    {
        index: {
            screen: ManagerScreen
        }
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
            headerForceInset: {left: 7,right:7},
        }
    }
);


const profile = createStackNavigator(
    {
        index: {
            screen: ProfileScreen
        },
        ProfileInfoScreen: {
            screen: ProfileInfoScreen
        },
        MessageInfoScreen: {
            screen: MessageInfoScreen //我的消息
        },
        SupplierInfoScreen: {
            screen: SupplierInfoScreen
        },
        CompanyInfoScreen: {
            screen: CompanyInfoScreen
        },
        TenantsInfoScreen: {
            screen: TenantsInfoScreen
        },

    }
    , {
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
            headerForceInset: {left: 7,right:7},
        }
    }
);


const TabStack = createBottomTabNavigator(
    {
        home: {
            screen: home,
            navigationOptions: {
                tabBarLabel: '冷库',
                tabBarIcon: ({focused, tintColor}) => (
                    <Icon name={`ios-home${focused ? '' : ''}`} size={25} color={tintColor}/>
                )
            }
        },
        manage: {
            screen: manager,
            navigationOptions: {
                tabBarLabel: '管理',
                tabBarIcon: ({focused, tintColor}) => (
                    <Icon name={`ios-archive${focused ? '' : ''}`} size={25} color={tintColor}/>
                )

            }
        },
        profile: {
            screen: profile,
            navigationOptions: {
                tabBarLabel: '个人',
                tabBarIcon: ({focused, tintColor}) => (
                    <Icon name={`ios-person${focused ? '' : ''}`} size={25} color={tintColor}/>
                )
            }
        },
    },
    {
        initialRouteName: 'profile',
        order: ['home', 'manage', 'profile'],
        mode: 'card',// 页面切换模式, 左右是card(相当于iOS中的push效果), 上下是modal(相当于iOS中的modal效果)
        headerMode: 'screen',
        navigationOptions: {
            gesturesEnabled: true,
        },
        tabBarOptions: {
            // label和icon的前景色 活跃状态下（选中）
            activeTintColor: theme.navColor,
            // label和icon的背景色 不活跃状态下
            // inactiveBackgroundColor: theme.lightGray,
            // label和icon的前景色 不活跃状态下(未选中)
            inactiveTintColor: theme.lightGray,
        }
    }
)


/**
 * 隐藏底部tab
 * @param navigation
 */

home.navigationOptions = ({navigation}) => {
    let {routeName} = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
    if (routeName !== 'index') {
        navigationOptions.tabBarVisible = false;
    }
    return navigationOptions;
};

manager.navigationOptions = ({navigation}) => {
    let {routeName} = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
    if (routeName !== 'index') {
        navigationOptions.tabBarVisible = false;
    }
    return navigationOptions;
};

profile.navigationOptions = ({navigation}) => {
    let {routeName} = navigation.state.routes[navigation.state.index];
    let navigationOptions = {};
    if (routeName !== 'index') {
        navigationOptions.tabBarVisible = false;
    }
    return navigationOptions;
};


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
        }),
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
    initialRouteName: 'signIn',
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
        signIn: {
            screen: SignInScreen,
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



const PerSignIn = createStackNavigator(
    {
        index: {
            screen: SignInScreen,
        },
    },
    {
        mode: 'modal',
        headerMode: 'none',
    }
)

const SwitchNavigator = createSwitchNavigator(
    {
        AuthLoading: AuthLoading,
        Auth: AuthStack,
        PerSignIn:PerSignIn,
        ImpAuth: ImpAuthStack,
        App: AppStack,

    },
    {
        initialRouteName: 'AuthLoading',
    }
)

