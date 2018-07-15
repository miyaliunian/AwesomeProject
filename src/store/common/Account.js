/**
 * Created by wufei on 2018/1/4.
 */
import {observable} from 'mobx'

class Account {
    @observable
    avatar = ''
    @observable
    phone = ''
    @observable
    pushId = ''
    @observable
    nickName = ''
    @observable
    addr = ''
    @observable
    userName = ''
    @observable
    userRole = ''
}

export default new Account()

