<template>
  <div class="app-container">
    <div class="login-window">
      <BaseForm class="login-form-area"
                ref="BaseForm"
                :formItemConfigGroup="formItemConfigGroup" />
      <div class="login-button-area">
        <el-button type="primary"
                   @click="login">登录</el-button>
      </div>

    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseForm from "@/components/base-form.vue";
import {
  BaseFormComponent,
  FormItemConfigGroup,
  FormType,
} from "@/component-interface";
import userApi from "@/api/user.api";
import { ElMessage } from "element-plus";
import Cookies from "js-cookie";
import store from "@/store";
export default defineComponent({
  name: "Login",
  components: { BaseForm },
  data() {
    return {
      formItemConfigGroup: [
        {
          label: "用户名",
          prop: "username",
          type: FormType.ElInput,
        },
        {
          label: "密码",
          prop: "password",
          type: FormType.ElInput,
        },
      ] as FormItemConfigGroup,
    };
  },
  methods: {
    login() {
      userApi
        .login((this.$refs.BaseForm as BaseFormComponent).getFormData())
        .then((res) => {
          const { code, msg, content } = res.data;
          store.dispatch("setUser", content);
          Cookies.set("token", content.access_token);
          ElMessage({
            message: msg,
            type: code === 0 ? "success" : "error",
          });
          if (code === 0) {
            this.$router.push("/layout/userManage");
          }
        });
    },
  },
});
</script>
<style lang="scss" scoped>
.app-container {
  background: #f5f5f5;
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-window {
    background: #fff;
    width: 1200px;
    height: 800px;
    box-shadow: 2px 2px 5px #888888;
    border-radius: 10px;
    text-align: center;
    // display: flex;
    // align-items: center;
    // justify-content: center;
    .login-logo {
      width: 300px;
      height: 300px;
      border-radius: 100%;
    }
    .login-form-area {
      margin-top: 80px;
      width: 80%;
      margin-left: 10%;
    }
    .login-button-area {
      text-align: center;
    }
  }
}
</style>