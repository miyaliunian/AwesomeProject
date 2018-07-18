/**
 * 管理页面
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    ScrollView,
} from 'react-native';
import theme from '../../common/theme'
import px2dp from '../../common/px2dp'
import MYInput from './MYInput'
import MYAreaInput from './MYAreaInput'
import {Checkbox, Select, Button} from 'teaset'
import TouchableItem from "react-navigation/src/views/TouchableItem";

export default class ManagerScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        // header: null
        headerTitle: "添加冷库",
    })

    constructor(props) {
        super(props)
        this.state = {
            valueVCustom: 'A',
            valueHCustom: '1',
        }
    }

    renderRow() {
        return (
            <View style={styles.cellHeaderStyle}>
                <MYInput placeholder='请输入'
                         title={'压缩机#1 : '}
                />
                <MYInput placeholder='单位：立方米'
                         title={'冷库容积 : '}
                />
            </View>
        )
    }

    insertCell(){
        alert('insertCell');
    }

    render() {
        return (
            <View style={theme.root_container}>
                <ScrollView>
                    <View style={styles.headerStyle}>
                        <MYInput placeholder='请输入'
                                 title={'冷库名称 : '}
                        />
                        <MYInput placeholder='单位：立方米'
                                 title={'冷库容积 : '}
                        />
                    </View>
                    {/*添加冷库*/}
                    <View style={{alignItems: 'center'}}>
                        <FlatList
                            data={[{key: 'a'}, {key: 'b'}]}
                            renderItem={() => this.renderRow()}
                        />
                        <Button title={'添加'}
                                style={styles.insertCellBtnStyle}
                                titleStyle={{fontSize: 13, color: 'white'}}
                            // disabled={props.btnSabled}
                               onPress={() => this.insertCell()}
                        />
                    </View>

                    {/*冷库划区*/}
                    <View style={styles.footerStyle}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                            marginRight: px2dp(30),
                            height: px2dp(100),
                            borderBottomColor: '#d1d1d1',
                            borderBottomWidth: theme.onePixel,
                            marginLeft: px2dp(30),

                        }}>
                            <Text >冷库划区 : </Text>
                            <Checkbox
                                style={{marginRight: px2dp(20), marginLeft: px2dp(15)}}
                                title='否'
                                size='lg'
                                titleStyle={styles.checkedTxtStyle}
                                checked={false}
                                // onChange={checked => alert(checked)}
                            />
                            <Checkbox
                                title='是'
                                size='lg'
                                titleStyle={styles.checkedTxtStyle}
                                checked={false}
                                // onChange={checked => alert(checked)}
                            />
                        </View>
                        <View style={styles.SelectContainStyle}>
                            <Text>横向 : </Text>
                            <Select
                                style={{width: px2dp(200)}}
                                value={this.state.valueVCustom}
                                items={['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']}
                                placeholder='请选择'
                                pickerTitle='横向选择范围:A~Z'
                                onSelected={(item, index) => this.setState({valueVCustom: item})}
                            />
                        </View>
                        <View style={styles.SelectContainStyle}>
                            <Text>纵向 : </Text>
                            <Select
                                style={{width: px2dp(200)}}
                                value={this.state.valueHCustom}
                                items={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']}
                                placeholder='请选择'
                                pickerTitle='纵向选择范围:1~30'
                                onSelected={(item, index) => this.setState({valueHCustom: item})}
                            />
                        </View>
                        <Checkbox
                            style={{marginLeft: px2dp(50), marginBottom: px2dp(40), marginTop: px2dp(30)}}
                            title='以上参数保存为默认值'
                            size='lg'
                            titleStyle={{fontSize: 13, color: theme.navColor}}
                            checked={false}
                            // onChange={checked => alert(checked)}
                        />
                    </View>
                    {/*签发冷库*/}
                    <View style={styles.footer2Style}>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                            marginRight: px2dp(30),
                            height: px2dp(80),
                            marginLeft: px2dp(30),
                            // backgroundColor:'red'
                        }}>
                            <Text >签发冷库 : 张三(17716879324)</Text>
                            <TouchableItem>
                                <Text style={{marginLeft: px2dp(20), fontSize: 13, color: theme.navColor}}>更改</Text>
                            </TouchableItem>
                        </View>
                        <View style={{
                            flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                            marginRight: px2dp(30),
                            height: px2dp(80),
                            marginLeft: px2dp(30),
                            // backgroundColor:'blue'
                        }}>
                            <Text >批量添加 : </Text>
                            <Checkbox
                                style={{marginRight: px2dp(20), marginLeft: px2dp(15)}}
                                title='否'
                                size='lg'
                                titleStyle={styles.checkedTxtStyle}
                                checked={false}
                                // onChange={checked => alert(checked)}
                            />
                            <Checkbox
                                title='是'
                                size='lg'
                                titleStyle={styles.checkedTxtStyle}
                                checked={false}
                                // onChange={checked => alert(checked)}
                            />
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerStyle: {
        width: theme.screenWidth - px2dp(32),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: px2dp(20),
        shadowOffset: {width: 1, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 1,
    },
    cellHeaderStyle: {
        width: theme.screenWidth - px2dp(32),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgb(214,233,252)',
        borderRadius: 10,
        marginTop: px2dp(20),
        shadowOffset: {width: 1, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 1,
    },
    insertCellBtnStyle: {
        width: px2dp(240),
        height: px2dp(60),
        marginTop: 11,
        backgroundColor: theme.themeColor,
        borderColor: 'transparent',
        borderRadius: 30
    },
    footerStyle: {
        width: theme.screenWidth - px2dp(32),
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: px2dp(20),
        shadowOffset: {width: 1, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 1,
    },
    checkedTxtStyle: {
        fontSize: 14
    },
    SelectContainStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: px2dp(24),
        marginLeft: px2dp(120),
    },
    footer2Style: {
        height: px2dp(160),
        width: theme.screenWidth - px2dp(32),
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: px2dp(20),
        shadowOffset: {width: 1, height: 0},
        shadowColor: 'black',
        shadowOpacity: 0.2,
        elevation: 1,
    },
});

