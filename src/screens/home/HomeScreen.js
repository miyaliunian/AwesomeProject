/**
 * Created by wufei on 2018/7/10.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Navigator,
    SafeAreaView,
    Image,
    DeviceEventEmitter
} from 'react-native';

import theme from '../../common/theme'
import {Toast} from 'teaset'
import px2dp from '../../common/px2dp';
import {inject} from 'mobx-react/native'
import { MapView,Marker} from 'react-native-amap3d'

@inject('account')
export default class HomeScreen extends Component {

    constructor(props) {
        super(props)

        this.state = {
            latitude: '',
            longitude: '',
        }
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener('toastInfo', (info, type) => {
            if (type === 'success') {
                Toast.success(info, 1500, 'center');
                return
            }
            if (type === 'fail') {
                Toast.fail(info, 1500, 'center');
                return
            }
            if (type === 'smile') {
                Toast.smile(info, 1500, 'center');
                return
            }
            if (type === 'sad') {
                Toast.sad(info, 1500, 'center');
                return
            }
            if (type === 'stop') {
                Toast.stop(info, 1500, 'center');
            }

        })

        navigator.geolocation.getCurrentPosition(location => {
            this.setState({latitude:location.coords.longitude,longitude:location.coords.latitude})
        })

    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    render() {
        return (
            <SafeAreaView style={theme.root_container}>
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
                        <Image source={require('../../icons/profile/default_portrait.png')}
                               style={{
                                   height: px2dp(160),
                                   width: px2dp(160),
                                   borderRadius: px2dp(80),
                                   marginRight: 10
                               }}/>
                    }
                </View>
                <MapView
                    style={styles.absoluteFill}
                    mapType='standard'
                    locationEnabled={true}
                    locationInterval={10000}
                    distanceFilter={10}
                    zoomLevel={18}
                    coordinate={{
                        latitude:  123.484027,
                        longitude: 41.70987,
                    }}
                    onLocation={({nativeEvent}) =>
                        console.log(`${nativeEvent.latitude}, ${nativeEvent.longitude}`)}
                />
            </SafeAreaView>
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
    absoluteFill: {
        width: theme.screenWidth,
        height: theme.screenHeight
    }
});

