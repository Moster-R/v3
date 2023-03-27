<template>
  <div style="flex: 1">
    <el-switch v-model="value" style="cursor: pointer" @click="toggleCollapse"/>
  </div>
  <div style="flex:22; display: inline-block; padding: 25px 0 0 3px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <!--      <el-breadcrumb-item v-for="(route,index) in tags" :key="index" :to="{ path: route.path }"><a href="/">{{ route.name }}</a></el-breadcrumb-item>-->
      <el-breadcrumb-item :to="item.to" v-for="(item,index) in breadcrumb" :key="index">{{ item.text }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-dropdown>
    <!--            <el-icon size="24px" style="margin-right: 15px; margin-top: 18px">-->
    <!--              <setting/>-->
    <!--            </el-icon>-->
    <div style="padding-top:8px; margin-right:20px">
      <!--<el-avatar style="font-size:14px"> 墨</el-avatar>-->
      <!--使用本地默认头像无法通过路径正常引用,通过引入的方式进行数据绑定-->
      <el-tooltip placement="left">
        <template #content>{{ user.username }}</template>
        <el-avatar v-if="user.avatarUrl=== null" :src="head"/>
        <el-avatar v-else :src="user.avatarUrl"/>
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="this.$router.push({name:'Person'})">个人信息</el-dropdown-item>
        <el-dropdown-item @click="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

</template>

<script>
import head from '../assets/img/head.jpg'
import {mapState} from "vuex";
import {ElNotification, ElMessageBox} from "element-plus";

export default {
  name: "Header",
  props: {
    toggleCollapse: Function,
  },
  data() {
    return {
      head: head, // 默认头像
      value: true,
      user: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : {},
    }
  },
  methods: {
    // 注销登录
    logout() {
      ElMessageBox.confirm('确定退出系统！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        window.localStorage.removeItem('userInfo')
        window.sessionStorage.removeItem('userInfo')
        // window.sessionStorage.removeItem('token')
        this.$router.replace('/login')
        // this.$router.push({name:'Login'})
        ElNotification({
          title: 'Success',
          message: '注销用户成功',
          type: 'success'
        })
      }).catch(() => {
        ElNotification({
          type: 'info',
          message: '已取消注销',
        })
      })
    }
  },
  computed: {
    ...mapState({breadcrumb: state => state.breadcrumb}),
  }
}
</script>

<style scoped>

</style>