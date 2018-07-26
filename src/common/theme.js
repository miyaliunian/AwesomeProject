'use strict';

import {Dimensions, Platform,PixelRatio} from 'react-native';
import px2dp from './px2dp'
export default module = {
    screenWidth: Dimensions.get('window').width,
    screenHeight: Dimensions.get('window').height,
    onePixel: 1 / PixelRatio.get(),
    //1dp的线
    line: {
        height: 1 / PixelRatio.get(),
        width:Dimensions.get('window').width,
        backgroundColor: '#dcdcdc'
    },
    //5dp的线
    line_space: {
        height: px2dp(5),
        width:Dimensions.get('window').width,
        backgroundColor: 'rgb(244,244,244)'
    },
    //10px的线
    line_space_10: {
        height: px2dp(10),
        width:Dimensions.get('window').width,
        // opacity:0.5,
        backgroundColor: 'rgb(244,244,244)'
    },
    //15px的线
    line_space_13: {
        height: px2dp(13),
        width:Dimensions.get('window').width,
        // opacity:0.5,
        backgroundColor: 'rgb(244,244,244)'
    },
    //15px的线
    line_space_30: {
        height: px2dp(25),
        width:Dimensions.get('window').width,
        // opacity:0.5,
        backgroundColor: 'rgb(244,244,244)'
    },
    // 每个页面的根样式
    root_container: {
        flex: 1,
        backgroundColor:'white',
        alignItems:'center',
    },
    btnActiveOpacity: 0.5,
    actionBar: {
        height: 44,//Platform.OS === 'android' ? 56 : 44 //根据不通平台高度不一致
        backgroundColor: '#fff'
    },
    barContentPad: (Platform.OS === 'android' ? 0 : (isIphoneX() ? 42 : 20)),
    //登录页面logo的位置
    bottomPadding: isIphoneX() ? 18 : 0,
    // 常用颜色
    sBarColor:'rgba(20,108,187,0.85)',
    navColor: '#55acee',
    themeColor:'#55acee',
    primaryColor: 'white',
    buttonColor: '#97b5d3',
    lightGray: '#cccccc',
    darkGray: '#e5e5e5',
};


// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

export function isIphoneX() {

    return (
        Platform.OS === 'ios' &&
        ((Dimensions.get('window').height === X_HEIGHT && Dimensions.get('window').width === X_WIDTH) ||
        (Dimensions.get('window').height === X_WIDTH && Dimensions.get('window').width === X_HEIGHT))
    )
}
