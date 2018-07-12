import {observable, action, computed, autorun} from 'mobx';

export default class SignUpMobxStore {
    @observable
    USER_INFO = {
        phone: '',//手机号
        verify:'',//验证码
        pwd: '',//密码
        conPwd:'',//确认密码
    };

    @computed get btnState(){
        if (this.USER_INFO.phone!= '' && this.USER_INFO.Verify!= ''&& this.USER_INFO.pwd!= ''&& this.USER_INFO.conPwd!= '' ){
            return false;
        }else {
            return true
        }
    }

}


