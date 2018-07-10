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
import ProfileItem from '../../components/ProfileItem'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';


export default class MyPage extends Component<{}> {
    static navigationOptions = ({navigation}) => ({
        // header: null
        headerTitle: "我的",
    })

    constructor(props) {
        super(props);
        this.state = {}
    }


    itemClick(info) {
        alert(info);
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
                            <Text style={styles.txtStyle}>15998362261</Text>
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
                                 callBack={() => this.itemClick('我的消息')}/>
                    <ProfileItem icon={require('../../icons/profile/to_pay.png')} title='公司消息'
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
        height:px2dp(240),
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
    imgTabBar: {
        height: px2dp(410) + (Platform.OS === 'android' ? 0 : theme.barContentPad),
        paddingTop: theme.barContentPad,
    },
});

