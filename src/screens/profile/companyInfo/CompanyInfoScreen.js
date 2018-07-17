/**
 * Created by wufei on 2018/7/16.
 * 公司信息
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Image,
} from 'react-native';
import theme from '../../../common/theme';
import px2dp from '../../../common/px2dp';
import {inject} from 'mobx-react/native'
import { MapView } from 'react-native-amap3d'

@inject('account')
export default class CompanyInfoScreen extends Component {

    static navigationOptions = ({navigation}) => ({
        headerTitle: '公司信息',
    })

    constructor(props) {
        super(props);
        this.state = {
            avatar: ''
        }
    }

    componentDidMount() {
        let {account} = this.props
        this.setState({
            avatar: account.avatar,
            latitude:'',
            longitude:'',
        })
    }

    render() {
        return (
            <View style={[theme.root_container, {alignItems: 'center'}]}>
                <View style={styles.headerStyle}>
                    {this.state.avatar
                        ?
                        <Image source={{uri: this.state.avatar}}
                               style={{
                                   height: px2dp(160),
                                   width: px2dp(160),
                                   borderRadius: px2dp(80),
                                   marginRight: 10
                               }}/>
                        :
                        <Image source={require('../../../icons/profile/default_portrait.png')}
                               style={{
                                   height: px2dp(160),
                                   width: px2dp(160),
                                   borderRadius: px2dp(80),
                                   marginRight: 10
                               }}/>
                    }

                    {/*地图信息*/}

                    <MapView
                        style={styles.mapStyle}
                        locationEnabled
                        locationInterval={10000}
                        coordinate={{
                            latitude: 55.755786,
                            longitude: 37.617633,
                        }}
                        onLocation={({nativeEvent}) =>
                            console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
                    />

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        height: px2dp(190),
        width: theme.screenWidth,
        backgroundColor: theme.navColor,
        paddingLeft: px2dp(24),
        paddingRight: px2dp(24),
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    mapStyle:{
        flex:1,
        width:theme.screenWidth,
        height:theme.screenHeight - px2dp(),

    }
});

