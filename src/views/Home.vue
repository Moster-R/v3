<template>
  <div class="common-layout">
    <el-container style="height:100vh;">
      <!--侧边菜单-->
      <el-aside :width="isCollapse ? '64px' : '200px'" style="box-shadow:2px 0 6px rgb(0 21 41/35%)">
        <!--        <el-aside width="200px">-->
        <!--<div class="toggle-button" @click="toggleCollapse">|||</div>-->
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
          <el-sub-menu index="1">
            <template #title>
              <el-icon>
                <Message/>
              </el-icon>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1">选项一</el-menu-item>
            <el-menu-item index="1-2">选项二</el-menu-item>
            <el-menu-item index="1-3">选项三</el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2">
            <el-icon>
              <Menu/>
            </el-icon>
            <template #title>导航二</template>
          </el-menu-item>
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
      </el-aside>

      <el-container>
        <!--头部内容-->
        <el-header style="font-size: 12px; border-bottom: 1px solid #ccc; line-height:60px;display: flex">
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
          <!--<span style="font-size:14px">Tom</span>-->
        </el-header>
        <!--中间内容-->
        <el-main>
          <div style="margin-bottom: 30px">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item
                ><a href="/">用户管理</a></el-breadcrumb-item
                >
              </el-breadcrumb>
          </div>
          <div style="padding:10px 0">
            <el-input  style="width:240px" placeholder="请输入名称">
              <template #suffix>
                <el-icon>
                  <Search/>
                </el-icon>
              </template>
            </el-input>
            <el-input  style="width:240px" placeholder="请输入邮箱">
              <template #suffix>
                <el-icon>
                  <Message/>
                </el-icon>
              </template>
            </el-input>
            <el-input  style="width:240px" placeholder="请输入地址">
              <template #suffix>
                <el-icon>
                  <Location/>
                </el-icon>
              </template>
            </el-input>
            <el-button type="primary" style="margin-left:5px">搜索</el-button>
          </div>
          <div style="margin:10px 0">
            <el-button type="primary">新增
              <el-icon :size="14" style="margin-left:5px"><CirclePlusFilled /></el-icon>
            </el-button>
            <el-button type="danger">批量删除
              <el-icon :size="14" style="margin-left:5px"><DeleteFilled /></el-icon>
            </el-button>
            <el-button type="primary">导入
              <el-icon :size="16" style="margin-left:5px"><UploadFilled /></el-icon>
            </el-button>
            <el-button type="primary">导出
              <el-icon :size="16" style="margin-left:5px"><Download /></el-icon>
            </el-button>
          </div>
          <el-table :data="tableData" border stripe :header-cell-class-name="headerBg">
            <el-table-column prop="date" label="日期" width="140"/>
            <el-table-column prop="name" label="名称" width="120"/>
            <el-table-column prop="address" label="地址"/>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button type="success">编辑
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button type="danger">删除
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="padding:10px 0">
            <el-pagination
                background layout="total, sizes, prev, pager, next, jumper"
                :total="400"/>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import head from '../assets/img/head.jpg'
export default {
  name: 'Home',
  data() {
    const item = {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles',
    }
    return {
      head: head, // 默认头像
      tableData: Array(10).fill(item),
      // 是否收起
      isCollapse: false,  // true是闭合的,默认是false展开
      // 开关
      value: true,
      headerBg:'headerBg'
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
    }
  }
}
</script>
<style>
.el-menu-item {
  background-color: rgb(48, 65, 86)
}
.headerBg{
  background: #8fc1f6 !important;
}

/*.toggle-button {*/
/*  添加背景颜色*/
/*  background-color: #4A5064;*/
/*  设置文本大小*/
/*  font-size: 10px;*/
/*  设置文本行高*/
/*  line-height: 24px;*/
/*  设置文本颜色*/
/*  color: #fff;*/
/*  设置文本居中*/
/*  text-align: center;*/
/*  设置文本间距*/
/*  letter-spacing: 0.2em;*/
/* 设置鼠标悬浮变小手效果*/
/*  cursor: pointer;*/
/*}*/
</style>


