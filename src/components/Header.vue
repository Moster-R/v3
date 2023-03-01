<template>

    <div style="flex: 1">
      <el-switch v-model="value" style="cursor: pointer" @click="toggleCollapse"/>
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
export default {
  name: "Header",
  props:{

    toggleCollapse:Function,
  },
  data(){
    return {
      head: head, // 默认头像
      value: true,
    }
  },
}
</script>

<style scoped>

</style>