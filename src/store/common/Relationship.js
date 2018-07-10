/**
 * Created by wufei on 2018/1/4.
 */
import {observable} from 'mobx'

class Relationship {
    @observable
    re_relaId = '';//主键
    @observable
    re_memberCode = '';//会员编码 member_basic_info
    @observable
    re_picUrl = '';
    @observable
    re_relaPerGenderName = '';
    @observable
    re_relaPerGenderCode = '';
    @observable
    re_relaTypeName = '';
    @observable
    re_relaPerName = '';
    @observable
    re_relaTypeCode = '';
    @observable
    re_relaPerBirthday = '';
    @observable
    re_relaPerMobilePhone = '';
    @observable
    isBuyService = '';
    @observable
    re_relaPerCertificateType = '';
    @observable
    re_relaPerCertificateName = '';
    @observable
    re_relaPerCertificateNo = ''
    @observable
    re_patientId = ''
}

export default new Relationship()

