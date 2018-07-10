/**
 * Created by wufei on 2018/7/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
import theme from '../common/theme'
import px2dp from '../common/px2dp'
import TextFix from "../common/TextFix";
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

export default class ProfileItem extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let {icon , title , callBack} = this.props
        return (
            <TouchableOpacity style={[styles.rowItem, styles.topBorder, {height: px2dp(120)}]} onPress = {callBack}>
                <View style={[theme.root_container,{flexDirection:'row'}]}>
                    <Image source={icon} style={styles.iconStyle}/>
                    <TextFix style={{fontSize: px2dp(32), color: '#333333', flex: 1}}>{title}</TextFix>
                    <SimpleLineIcons
                        name={'arrow-right'}
                        size={20}
                        color={'#999'}/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    iconStyle:{
      marginRight:px2dp(20),
    },
    rowItem: {
        marginHorizontal: px2dp(24),
        flexDirection: 'row',
        alignItems: 'center'
    },
    topBorder: {
        borderTopWidth: px2dp(1),
        borderTopColor: '#f5f5f5'
    }
});

