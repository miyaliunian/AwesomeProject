import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    AsyncStorage,
    Text,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import theme from '../../common/theme';
import px2dp from '../../common/px2dp';
import Account from '../../store/common/Account'
import {moreMenu} from '../../config/moreMenu';
import ProfileItem from '../../components/ProfileItem'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ActionSheet from 'react-native-actionsheet'
import {inject} from 'mobx-react/native'

@inject('account')
export default class MyPage extends Component<{}> {
    static navigationOptions = ({navigation}) => ({
        // header: null
        headerTitle: "我的",
    })

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            userName: '',
            avatar: ''
        }
    }

    componentDidMount() {
        this.refreshScreen()
    }

    //刷新数据
    refreshScreen(){
        let {account} = this.props
        this.setState({
            phone: account.phone,
            userName: account.userName,
            avatar: account.avatar,
            userRole: account.userRole
        })
    }

    //导航菜单
    itemClick(target) {
        //回调函数
        this.props.navigation.navigate(target,{ callback: () => this.refreshScreen()})
    }

    //弹出actionSheet
    showActionSheet() {
        this.ActionSheet.show()
    }

    handlePress(index) {
        if (1 != index){
            //退出登录:清除本地缓存
            AsyncStorage.clear()
            //清除App注入缓存
            this.removeRepository()
            this.props.navigation.navigate('Auth');
        }
    }

    //清除App注入缓存
    removeRepository() {
        this.account = Account;
        this.account.avatar = '';
        this.account.phone = ''
        this.account.pushId = ''
        this.account.userId = ''
        this.account.userName = ''
        this.account.userRole = ''
    }


    render() {
        return (
            <View style={theme.root_container}>
                <View style={styles.headerStyle}>
                    <View style={{flexDirection: 'row'}}>
                        {this.state.avatar ?
                            <Image source={{uri: this.state.avatar}}
                                   style={{
                                       height: px2dp(160),
                                       width: px2dp(160),
                                       borderRadius: px2dp(80),
                                       marginRight: 10
                                   }}/>
                            :
                            <Image source={require('../../icons/profile/default_portrait.png')}
                                   style={{
                                       height: px2dp(160),
                                       width: px2dp(160),
                                       borderRadius: px2dp(80),
                                       marginRight: 10
                                   }}/>
                        }

                        <View style={{justifyContent: 'center'}}>
                            <Text style={styles.txtStyle}>{this.state.userName}</Text>
                            <Text style={styles.txtStyle}>{this.state.phone}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={{width: 50, height: 50, alignItems: 'flex-end',justifyContent:'center'}}
                                      onPress={() => this.itemClick(moreMenu.ProfileScreen.menu_profile_info)}>
                        <SimpleLineIcons
                            name={'note'}
                            size={20}
                            color={'white'}/>
                    </TouchableOpacity>
                </View>
                <View style={theme.line_space_10}/>
                <ScrollView>
                    <ProfileItem icon={require('../../icons/profile/icon_me_info.png')} title='我的消息'
                                 callBack={() => this.itemClick('我的消息')}/>
                    <ProfileItem icon={require('../../icons/profile/icon_company_info.png')} title='公司信息'
                                 callBack={() => this.itemClick(moreMenu.ProfileScreen.menu_company_info)}/>

                    {/*工程商、冷库老板 显示:员工管理:1、3*/}
                    {this.state.userRole == '1' || this.state.userRole == '3'
                        ?
                        <ProfileItem icon={require('../../icons/profile/icon_yggl.png')} title='员工管理'
                                     callBack={() => this.itemClick('员工管理')}/>
                        :
                        null
                    }

                    {/*冷库老板 显示:租客管理:3*/}
                    {this.state.userRole == '3'
                        ?
                        <ProfileItem icon={require('../../icons/profile/icon_sz_info.png')} title='租客管理'
                                     callBack={() => this.itemClick(moreMenu.ProfileScreen.menu_tenants_info)}/>
                        :
                        null
                    }

                    {/*工程人员、冷库员工、冷库租客 显示:提出公司:2、4、5*/}
                    {this.state.userRole == '2' || this.state.userRole == '4' || this.state.userRole == '5'
                        ?
                        <ProfileItem icon={require('../../icons/profile/icon_tcgs.png')} title='退出公司'
                                     callBack={() => this.itemClick('退出公司')}/>
                        :
                        null
                    }


                    {/*空角色、工程商 显示:我的账单:0、1、3、4*/}
                    {this.state.userRole == '0' || this.state.userRole == '1' || this.state.userRole == '3' || this.state.userRole == '4'
                        ?
                        <ProfileItem icon={require('../../icons/profile/icon_wdzd.png')} title='我的账单'
                                     callBack={() => this.itemClick('我的账单')}/>
                        :
                        null
                    }

                    <ProfileItem icon={require('../../icons/profile/icon_tcdl.png')} title='退出登录'
                                 callBack={() => this.showActionSheet()}/>
                    <View style={theme.line}/>
                </ScrollView>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    title={'退出后不会删除任何历史数据，下次登录依然可以使用本账号。'}
                    options={['退出登录', '取消']}
                    cancelButtonIndex={1}
                    destructiveButtonIndex={0}
                    onPress={(index) => this.handlePress(index)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: px2dp(190),
        width: theme.screenWidth,
        backgroundColor: theme.navColor,
        flexDirection: 'row',
        paddingLeft: px2dp(24),
        paddingRight: px2dp(24),
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txtStyle: {
        color: 'white',
        fontSize: 17,
        marginVertical: 5,
    },
});

