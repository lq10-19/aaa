import Vue from 'vue'
import Router from 'vue-router'
import Apply from './views/apply/Apply.vue';
import ApplyIndex from './views/apply/ApplyIndex.vue';
import ApplyResult from './views/apply/ApplyResult.vue';
import CarInfo from './views/apply/CarInfo.vue';
import PersonalInfo from './views/apply/PersonalInfo.vue';
import IdCardInfo from './views/apply/IdCardInfo.vue';
import AddIdCard from './views/apply/AddIdCard.vue';
import EditAddress from './views/apply/EditAddress.vue';
import EarlyExamine from './views/apply/EarlyExamine.vue';
import EarlyExamineRefuse from './views/apply/EarlyExamineRefuse.vue';
import ConfirmLoanPlan from './views/apply/ConfirmLoanPlan.vue';
import AddDrivingLicense from './views/apply/AddDrivingLicense.vue';
import DrivingLicenseInfo from './views/apply/DrivingLicenseInfo.vue';
import Replenish from './views/apply/Replenish.vue';
import AddDriveImg from './views/apply/AddDriveImg.vue';
import OrderList from './views/details/orderList.vue';
import OrderDetails from './views/details/orderDetails.vue';
import Continue from './views/details/continue.vue';
import LoanMsg from './views/details/msg/loanMsg.vue';
import ApplicantMsg from './views/details/msg/applicantMsg.vue';
import ContactsMsg from './views/details/msg/contactsMsg.vue';
import EnclosureMsg from './views/details/msg/enclosureMsg.vue';
import EnclosureDetails from './views/details/msg/enclosureDetails.vue';
import FileUploadIndex from './views/fileUpload/fileUpload_index.vue';
import fileUploadDetails from './views/fileUpload/fileUpload_details.vue';
import fileUploadSuccess from './views/fileUpload/fileUpload_success.vue';
import demo from './views/fileUpload/demo.vue';
import PersonalAuthorization from './views/document/PersonalAuthorization.vue';
import InformationAuthorization from './views/document/InformationAuthorization.vue';
import PersonalCreditReporting from './views/document/PersonalCreditReporting.vue';
import RiskWarning from './views/document/RiskWarning.vue';
//保险分期
import carInsuranceApply from './views/insurance/carInsuranceApply.vue';
import carInsuranceInfo from './views/insurance/carInsuranceInfo.vue';
import financingInfo from './views/insurance/financingInfo.vue';
import uploadIdCard from './views/insurance/uploadIdCard.vue';
import idCardInfo2 from './views/insurance/idCardInfo2.vue';
import partnerInfo from './views/insurance/partnerInfo.vue';
import contactsInfo from './views/insurance/contactsInfo.vue';
import guarantorInfo from './views/insurance/guarantorInfo.vue';
import insuranceOrderList from './views/insurance/insuranceOrderList.vue';
import insuranceOrderDetails from './views/insurance/insuranceOrderDetails.vue';
import customerInformation from './views/insurance/customerInformation.vue';
import carInformation from './views/insurance/carInformation.vue';
import uploadBusinessLicense from './views/insurance/uploadBusinessLicense.vue';
import businessLicenseInfo from './views/insurance/businessLicenseInfo.vue';
import personal from './views/insurance/personal.vue';
import company from './views/insurance/company.vue';
import financingInformation from './views/insurance/financingInformation.vue';
import applySuccess from './views/insurance/applySuccess.vue';
Vue.use(Router)
const routerConfig = new Router({
  mode: 'history',
  //mode: 'hash',
  base: process.env.VUE_APP_BASE_URL,
  routes: [
    {
      path: '/applyIndex',
      name: 'applyIndex',
      component: ApplyIndex
    },
    {
      path: '/apply',
      name: 'apply',
      component: Apply
    },
    {
      path: '/applyResult',
      name: 'applyResult',
      component: ApplyResult
    },
    {
      path: '/carInfo',
      name: 'carInfo',
      component: CarInfo
    },
    {
      path: '/personalInfo',
      name: 'personalInfo',
      component: PersonalInfo
    },
    {
      path: '/idCardInfo',
      name: 'idCardInfo',
      component: IdCardInfo
    },
    {
      path: '/addIdCard',//add 身份证
      name: 'addIdCard',
      component: AddIdCard
    },
    {
      path: '/editAddress',
      name: 'editAddress',
      component: EditAddress
    },
    {
      path: '/earlyExamine',
      name: 'earlyExamine',
      component: EarlyExamine
    },
    {
      path: '/earlyExamineRefuse',
      name: 'earlyExamineRefuse',
      component: EarlyExamineRefuse
    },
    {
      path: '/confirmLoanPlan',
      name: 'confirmLoanPlan',
      component: ConfirmLoanPlan
    },
    {
      path: '/addDrivingLicense',
      name: 'addDrivingLicense',//行驶证拍照
      component: AddDrivingLicense
    },
    {
      path: '/drivingLicenseInfo',
      name: 'drivingLicenseInfo',//行驶证信息详情
      component: DrivingLicenseInfo
    },
    {
      path: '/replenish',
      name: 'replenish',//进件信息
      component: Replenish
    },
    {
      path: '/addDriveImg',
      name: 'addDriveImg',//上传驾驶证照片
      component: AddDriveImg
    },
    {
      path: '/orderList',
      name: 'orderList',//订单列表
      component: OrderList
    },
    {
      path: '/orderDetails',
      name: 'orderDetails',//订单详情
      component: OrderDetails
    },
    {
      path: '/continue',
      name: 'continue',//订单详情(继续申请)
      component: Continue
    },
    {
      path: '/loanMsg',
      name: 'loanMsg',//贷款信息
      component: LoanMsg
    },
    {
      path: '/applicantMsg',
      name: 'applicantMsg',//申请人信息
      component: ApplicantMsg
    },
    {
      path: '/contactsMsg',
      name: 'contactsMsg',//联系人信息
      component: ContactsMsg
    },
    {
      path: '/enclosureMsg',
      name: 'enclosureMsg',//附件信息
      component: EnclosureMsg
    },
    {
      path: '/enclosureDetails',
      name: 'enclosureDetails',//附件详情
      component: EnclosureDetails
    },
    {
      path: '/fileUpload_index',
      name: 'fileUpload_index',//附件上传
      component: FileUploadIndex
    },
    {
      path: '/fileUpload_details',
      name: 'fileUpload_details',//附件上传详情
      component: fileUploadDetails
    },
    {
      path: '/fileUpload_success',
      name: 'fileUpload_success',//附件上传成功
      component: fileUploadSuccess
    },
    {
      path: '/demo',
      name: 'demo',//
      component: demo
    },
    {
      path: '/personalAuthorization',
      name: 'personalAuthorization',//个人授权征信
      component: PersonalAuthorization
    },
    {
      path: '/informationAuthorization',
      name: 'informationAuthorization',//信息使用授权书
      component: InformationAuthorization
    },
    {
      path: '/personalCreditReporting',
      name: 'personalCreditReporting',//授权书（个人征信业务）
      component: PersonalCreditReporting
    },
    {
      path: '/riskWarning',
      name: 'riskWarning',//反欺诈风险提示
      component: RiskWarning
    },
    //保险分期
    {
      path: '/carInsuranceApply',
      name: 'carInsuranceApply',//车险申请（主页）
      component: carInsuranceApply
    },
    {
      path: '/carInsuranceInfo',
      name: 'carInsuranceInfo',//保险信息
      component: carInsuranceInfo
    },
    {
      path: '/financingInfo',
      name: 'financingInfo',//融资信息
      component: financingInfo
    },
    {
      path: '/uploadIdCard',
      name: 'uploadIdCard',//上传身份证
      component: uploadIdCard
    },
    {
      path: '/idCardInfo2',
      name: 'idCardInfo2',//身份证信息
      component: idCardInfo2
    },
    {
      path: '/partnerInfo',
      name: 'partnerInfo',//配偶信息
      component: partnerInfo
    },
    {
      path: '/contactsInfo',
      name: 'contactsInfo',//联系人信息
      component: contactsInfo
    },
    {
      path: '/guarantorInfo',
      name: 'guarantorInfo',//保证人信息
      component: guarantorInfo
    },
    {
      path: '/insuranceOrderList',
      name: 'insuranceOrderList',//保险分期订单列表
      component: insuranceOrderList
    },
    {
      path: '/insuranceOrderDetails',
      name: 'insuranceOrderDetails',//保险分期订单详情
      component: insuranceOrderDetails
    },
    {
      path: '/customerInformation',
      name: 'customerInformation',//联系人信息
      component: customerInformation
    },
    {
      path: '/carInformation',
      name: 'carInformation',//车辆信息
      component: carInformation
    },
    {
      path: '/uploadBusinessLicense',
      name: 'uploadBusinessLicense',//上传企业执照
      component: uploadBusinessLicense
    },
    {
      path: '/businessLicenseInfo',
      name: 'businessLicenseInfo',//企业执照信息
      component: businessLicenseInfo
    },
    {
      path: '/personal',
      name: 'personal',//个人进件
      component: personal
    },
    {
      path: '/company',
      name: 'company',//公司进件
      component: company
    },
    {
      path: '/financingInformation',
      name: 'financingInformation',//融资信息
      component: financingInformation
    },
    {
      path: '/applySuccess',
      name: 'applySuccess',//提交成功
      component: applySuccess
    },
  ]
});
export default routerConfig;
