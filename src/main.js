import Vue from 'vue'
import App from './App.vue'
import router from './router'
import request from './request.js';
import requestBx from './request2.js';
import VueMeta from 'vue-meta'
import "./assets/css/public.css";
// 图片预览
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
//vant
import { Loading, Area, Popup, DatetimePicker, Picker, Toast, Cell, CellGroup, Field, Radio, Progress, Button, Checkbox, Dialog, ImagePreview, DropdownItem, DropdownMenu, Icon } from "vant";
Vue.use(Loading)
  .use(Area)
  .use(Popup)
  .use(DatetimePicker)
  .use(Picker)
  .use(Toast)
  .use(Cell)
  .use(CellGroup)
  .use(Field)
  .use(Radio)
  .use(Progress)
  .use(Button)
  .use(Checkbox)
  .use(Dialog)
  .use(ImagePreview)
  .use(DropdownItem)
  .use(DropdownMenu)
  .use(Icon)

Vue.config.productionTip = false
// rem配置
document.getElementsByTagName("html")[0].style.fontSize = 100 * window.screen.width / 750 + 'px';
// 引入公共样式

Vue.use(VueMeta, {
  // optional pluginOptions
  refreshOnceOnNavigation: true
});

var options = {
  fullscreenEl: false //关闭全屏按钮
}

Vue.use(preview, options)

Vue.prototype.$request = request;
Vue.prototype.$requestBx = requestBx;
Vue.prototype.$baseInfo = Object.assign({}, process.env);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');