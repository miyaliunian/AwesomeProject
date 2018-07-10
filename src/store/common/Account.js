/**
 * Created by wufei on 2018/1/4.
 */
import {observable} from 'mobx'

class Account {
    @observable
    name = '初始化'
}

export default new Account()

