/**
 * Created by wufei on 2018/1/4.
 */
import {observable} from 'mobx'

class Account {
    @observable
    ID = ''; //doctor_account_info 表主键
    @observable
    code = '';//医生编号
    @observable
    mobilePhone = '';
}

export default new Account()

