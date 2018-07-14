import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
    AsyncStorage,
    Text,
    ScrollView
} from 'react-native';

import theme from '../../common/theme';
import px2dp from '../../common/px2dp';
import Account from '../../store/common/Account'
import {moreMenu} from '../../config/moreMenu';
import ProfileItem from '../../components/ProfileItem'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import ActionSheet from 'react-native-actionsheet'
import {inject} from 'mobx-react/native'

// ActionSheet常量定义
const CANCEL_INDEX = 0;
const DESTRUCTIVE_INDEX = 2;
const options = ['是', '否'];
const title = '确定退出登录?';

@inject('account')
export default class MyPage extends Component<{}> {
    static navigationOptions = ({navigation}) => ({
        // header: null
        headerTitle: "我的",
    })

    constructor(props) {
        super(props);
        this.state = {
            phone:'',
            userName:''
        }
    }

    componentDidMount() {
        let {account} = this.props
        this.setState({
            phone : account.phone
        })
        console.log(account)
    }


    itemClick(target) {
        this.props.navigation.navigate(target)
    }

    showActionSheet() {
        this.ActionSheet.show()
    }

    handlePress(i) {
        if (i == 0) {
            //退出登录:清除本地缓存
            AsyncStorage.clear()
            //清除App注入缓存
            this.removeRepository()
            this.props.navigation.navigate('Auth');

        }
    }

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
                        <Image source={require('../../icons/profile/default_portrait.png')}
                               style={{
                                   height: px2dp(160),
                                   width: px2dp(160),
                                   borderRadius: px2dp(80),
                                   marginRight: 10
                               }}/>
                        <View style={{justifyContent:'center'}}>
                            <Text style={styles.txtStyle}>姓名</Text>
                            <Text style={styles.txtStyle}>{this.state.phone}</Text>
                        </View>
                    </View>
                    <SimpleLineIcons
                        name={'arrow-right'}
                        size={20}
                        color={'white'}/>
                </View>
                <View style={theme.line_space_10}/>
                <ScrollView>
                    <ProfileItem icon={require('../../icons/profile/to_pay.png')} title='我的消息'
                                 callBack={() => this.itemClick(moreMenu.ProfileScreen.menu_profile_info)}/>
                    <ProfileItem icon={require('../../icons/profile/icon_comInfo.png')} title='公司消息'
                                 callBack={() => this.itemClick('公司消息')}/>
                    <ProfileItem icon={require('../../icons/profile/to_pay.png')} title='员工管理'
                                 callBack={() => this.itemClick('员工管理')}/>
                    <ProfileItem icon={require('../../icons/profile/to_pay.png')} title='租客管理'
                                 callBack={() => this.itemClick('租客管理')}/>
                    <ProfileItem icon={require('../../icons/profile/to_pay.png')} title='退出公司'
                                 callBack={() => this.itemClick('退出公司')}/>
                    <ProfileItem icon={require('../../icons/profile/to_pay.png')} title='我的账单'
                                 callBack={() => this.itemClick('我的账单')}/>
                    <ProfileItem icon={require('../../icons/profile/to_pay.png')} title='退出登录'
                                 callBack={() => this.showActionSheet()}/>
                    <View style={theme.line}/>
                </ScrollView>
                <ActionSheet
                    ref={actionSheet => this.ActionSheet = actionSheet}
                    title={title}
                    options={options}
                    cancelButtonIndex={CANCEL_INDEX}
                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                    onPress={async (i) => this.handlePress(i)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height:px2dp(190),
        width:theme.screenWidth,
        backgroundColor: theme.navColor,
        flexDirection: 'row',
        paddingLeft: px2dp(24),
        paddingRight: px2dp(24),
        justifyContent:'space-between',
        alignItems: 'center'
    },
    txtStyle: {
        color: 'white',
        fontSize: 17,
        marginVertical: 5,
    },
});

