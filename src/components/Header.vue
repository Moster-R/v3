<template>
  <div style="flex: 1">
    <el-switch v-model="value" style="cursor: pointer" @click="toggleCollapse"/>
  </div>
  <div style="flex:22; display: inline-block; padding: 25px 0 0 3px;">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
<!--      <el-breadcrumb-item v-for="(route,index) in tags" :key="index" :to="{ path: route.path }"><a href="/">{{ route.name }}</a></el-breadcrumb-item>-->
      <el-breadcrumb-item :to="item.path" v-for="(item,index) in tags" :key="index">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <el-dropdown>
    <!--            <el-icon size="24px" style="margin-right: 15px; margin-top: 18px">-->
    <!--              <setting/>-->
    <!--            </el-icon>-->
    <div style="padding-top:8px; margin-right:20px">
      <!--<el-avatar style="font-size:14px"> 墨</el-avatar>-->
      <!--使用本地默认头像无法通过路径正常引用,通过引入的方式进行数据绑定-->
      <el-tooltip content="Tom" placement="left">
        <el-avatar :src="head"/>
      </el-tooltip>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>个人信息</el-dropdown-item>
        <el-dropdown-item>退出</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

</template>

<script>
import head from '../assets/img/head.jpg'
import {mapState} from "vuex";
export default {
  name: "Header",
  props: {
    toggleCollapse: Function,
  },
  data() {
    return {
      head: head, // 默认头像
      value: true,
    }
  },
  computed:{
    ...mapState({tags:state =>  state.tags})
  }
}
</script>

<style scoped>

</style>