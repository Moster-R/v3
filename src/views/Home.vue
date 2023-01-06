<template>
  <div class="common-layout">
    <el-container style="height:100vh">
      <!--侧边菜单-->
      <el-aside width=":isCollapsed ? '64px' : '200px'">
        <!--      <el-aside width="200px">-->
        <!--        <div class="toggle-button" @click="toggleCollapse">|||</div>-->
        <el-menu
            default-active="2"
            :collapse="isCollapse"
            class="el-menu-vertical-demo"
            style="min-height: 100%;
            background-color:rgb(48,65,86)"
        >
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <Message/>
              </el-icon>
              <span>Navigator One</span>
            </template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon>
                <Menu/>
            </el-icon>
            <template #title>Navigator Two</template>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <el-icon>
              <document/>
            </el-icon>
            <template #title>Navigator Three</template>
          </el-menu-item>
          <el-menu-item index="4">
            <el-icon>
              <setting/>
            </el-icon>
            <template #title>Navigator Four</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!--头部内容-->
        <el-header style="font-size: 12px; border-bottom: 1px solid #ccc; line-height:60px;display: flex">
          <div style="flex: 1">
<!--            <el-icon size="20px" style="cursor: pointer" @click="toggleCollapse">-->
<!--              <Fold/>-->
<!--            </el-icon>-->
            <el-switch v-model="value" style="cursor: pointer" @click="toggleCollapse"/>
          </div>
            <el-dropdown>
              <el-icon style="margin-right: 8px; margin-top: 24px">
                <setting/>
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>View</el-dropdown-item>
                  <el-dropdown-item>Add</el-dropdown-item>
                  <el-dropdown-item>Delete</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <span>Tom</span>
        </el-header>
        <!--中间内容-->
        <el-main>
          <el-scrollbar>
            <el-table :data="tableData">
              <el-table-column prop="date" label="Date" width="140"/>
              <el-table-column prop="name" label="Name" width="120"/>
              <el-table-column prop="address" label="Address"/>
            </el-table>
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    }
    return {
      tableData: Array(10).fill(item),
      // 是否收起
      isCollapse: false,
      // 开关
      value:true


    }
  },
  methods: {
    toggleCollapse() {
      // 取反
      this.isCollapse = !this.isCollapse
      // 开关展开菜单
      if (this.value!== true){
        this.value = false
      }
    }
  }
}
</script>
<style scoped>
.el-menu-item {
  background-color: rgb(48, 65, 86)
}

/*.toggle-button {*/
/*  !*添加背景颜色*!*/
/*  background-color: #4A5064;*/
/*  !*设置文本大小*!*/
/*  font-size: 10px;*/
/*  !*设置文本行高*!*/
/*  line-height: 24px;*/
/*  !*设置文本颜色*!*/
/*  color: #fff;*/
/*  !*设置文本居中*!*/
/*  text-align: center;*/
/*  !*设置文本间距*!*/
/*  letter-spacing: 0.2em;*/
/*  !*设置鼠标悬浮变小手效果*!*/
/*  cursor: pointer;*/
/*}*/
</style>


