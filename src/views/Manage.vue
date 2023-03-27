<template>
  <div class="common-layout">
    <el-container style="height:100vh;">
      <!--侧边菜单-->
      <el-aside :width="isCollapse ? '64px' : '200px'" style="box-shadow:2px 0 6px rgb(0 21 41/35%)">
        <Aside :is-collapse="isCollapse"></Aside>
      </el-aside>
      <el-container>
        <!--头部内容-->
        <el-header style="font-size: 12px; border-bottom: 1px solid #ccc; line-height:60px;display: flex">
          <Header :toggleCollapse="toggleCollapse"></Header>
        </el-header>
        <TopTag/>
        <!--中间内容-->
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>


import Aside from "@/components/Aside";
import Header from "@/components/Header";
import TopTag from "@/components/TopTag";
export default {
  components:{
    Aside,
    Header,
    TopTag
  },
  name: 'Manage',
  data() {
    return {
      // 是否收起
      isCollapse: false,  // true是闭合的,默认是false展开
      // 开关
      value: true,
    }
  },
  methods: {
    toggleCollapse() {  //菜单收起展开
      // 取反折叠菜单
      this.isCollapse = !this.isCollapse
      // 开关控制
      if (this.value !== true) {
        this.value = false
      }
    },
  },
}
</script>
<style>
.el-menu-item {
  background-color: rgb(48, 65, 86)
}

</style>


