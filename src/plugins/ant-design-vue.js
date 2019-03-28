import Vue from "vue";
import {
  Modal,
  Layout,
  Menu,
  Icon,
  Row,
  Col,
  Tag,
  Skeleton,
  Divider,
  Form,
  Input,
  Select,
  Button,
  message,
  notification,
  Collapse,
  Tabs,
  Alert,
  Tooltip,
  InputNumber,
  Radio
} from "ant-design-vue";

Vue.use(Modal);
Vue.use(Layout);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tag);
Vue.use(Skeleton);
Vue.use(Divider);
Vue.use(Form);
Vue.use(Input);
Vue.use(Select);
Vue.use(Button);
Vue.use(Collapse);
Vue.use(Tabs);
Vue.use(Alert);
Vue.use(Tooltip);
Vue.use(InputNumber);
Vue.use(Radio);

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
