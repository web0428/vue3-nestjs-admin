import { createApp } from 'vue';
import ElementPlus, { ElIcon } from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import '/src/css/init.scss'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus, { locale: zhCn, });
app.mount('#app');
