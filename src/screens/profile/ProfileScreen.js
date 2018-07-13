import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    TouchableOpacity,
    Image,
    ImageBackground,
    Text,
    ScrollView
} from 'react-native';

import theme from '../../common/theme';
import px2dp from '../../common/px2dp';
import {moreMenu} from '../../config/moreMenu';
import ProfileItem from '../../components/ProfileItem'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

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
                                 callBack={() => this.itemClick('退出登录')}/>
                    <View style={theme.line}/>
                </ScrollView>
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

