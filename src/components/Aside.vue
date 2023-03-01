<template>
  <el-menu
      default-active="2"
      :collapse="isCollapse"
      class="el-menu-vertical-demo"
      :collapse-transition="false"
      style="min-height: 100%;
            background-color:rgb(48,65,86);"
  >
    <div style="height:60px;line-height: 60px;text-align:center;overflow:hidden;">
      <img src="../assets/img/logo.png" style="width:30px;position:relative; top: 10px" alt="">
      <b style="color:white;" v-show="!isCollapse">后台管理系统</b>
    </div>
    <el-menu-item index="1">
      <el-icon>
        <homeFilled/>
      </el-icon>
      <template #title>主页</template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <Menu/>
        </el-icon>
        <span>系统管理</span>
      </template>
      <el-menu-item index="2-1">用户管理</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3" disabled>
      <el-icon>
        <document/>
      </el-icon>
      <template #title>导航三</template>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon>
        <setting/>
      </el-icon>
      <template #title>导航四</template>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
  }
}
</script>

<style scoped>

</style>