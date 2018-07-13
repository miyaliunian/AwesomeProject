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

import theme from '../../../common/theme';
import px2dp from '../../../common/px2dp';
import {moreMenu} from '../../../config/moreMenu';
import ProfileItem from '../../../components/ProfileItem'
import {inject} from 'mobx-react/native'
@inject('account')
export default class ProfileInfoScreen extends Component<{}> {
    static navigationOptions = ({navigation}) => ({
        headerTitle: "",
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
                    <Image source={require('../../../icons/profile/default_portrait.png')}
                           style={{
                               height: px2dp(160),
                               width: px2dp(160),
                               borderRadius: px2dp(80),
                               marginRight: 10
                           }}/>
                </View>
                <View style={theme.line_space_10}/>
                <ScrollView>

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
        justifyContent:'center',
        alignItems: 'center'
    }
});

