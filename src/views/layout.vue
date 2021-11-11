<template>
  <el-container style="height: 100vh; border: 1px solid #eee">
    <el-aside width="200px"
              style="background-color: rgb(238, 241, 246)">
      <el-menu :default-active="$route.path">
        <el-menu-item v-for="item in mainRoutes"
                      @click="routePath(item.path)"
                      :key="item.path"
                      :index="`${item.path}`">
          <el-icon>
            <icon-menu />
          </el-icon>
          <span>{{item.routeName}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <el-dropdown @command="handleCommand">
          <el-avatar :src="`/api/upload/${user.avatarId}`"
                     :size="50"></el-avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span>{{user.username}}</span>
      </el-header>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { Message, Menu, Setting } from "@element-plus/icons";
import { mapState } from "vuex";
import Cookies from "js-cookie";
import { mainRoutes } from "@/router/index";

export default defineComponent({
  components: {
    Message,
    Setting,
    "icon-menu": Menu,
  },
  data() {
    return {
      mainRoutes: mainRoutes,
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    handleCommand(command: string) {
      if (command === "logout") {
        Cookies.remove("token");
        localStorage.removeItem("user");
        this.$router.push("/login");
      }
    },
    routePath(url: string) {
      this.$router.push(url);
    },
  },
  mounted() {
    console.log(mainRoutes);
  },
});
</script>

<style>

.el-aside {
  color: var(--el-text-color-primary);
}
</style>
