<template>
  <div>
    <div style="padding:5px 0">
      <el-input style="width:240px" v-model="name" placeholder="请输入名称">
        <template #suffix>
          <el-icon>
            <Search/>
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" style="margin-left:5px" @click="load()">搜索</el-button>
      <el-button type="warning" style="margin-left:5px" @click="reset">重置</el-button>
    </div>
    <div style="margin:10px 0">
      <el-upload action="http://localhost:8466/files/upload"
                 :show-file-list="false"
                 :on-progress="handleUploadProgress"
                 style="display:inline-block;margin-left:10px;padding-right: 10px;"
      >
        <el-button type="primary">文件上传
          <el-icon :size="16" style="margin-left:5px">
            <UploadFilled/>
          </el-icon>
        </el-button>
      </el-upload>
      <el-button type="danger" :disabled="multipleSelection.length===0" @click="delBatch">批量删除
        <el-icon :size="14" style="margin-left:5px">
          <DeleteFilled/>
        </el-icon>
      </el-button>
      <el-progress :percentage="percent"></el-progress>
    </div>
    <el-table :data="tableData"
              border
              stripe
              :header-cell-class-name="headerBg"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"/>
      <el-table-column prop="id" label="ID"/>
      <el-table-column prop="name" label="文件名称"/>
      <el-table-column prop="type" label="文件类型"/>
      <el-table-column prop="size" label="文件大小(KB)"/>
      <el-table-column label="下载">
        <template #default="scope">
          <el-button type="primary" :disabled="!scope.row.enable" @click="download(scope.row.url)">下载</el-button>
        </template>
      </el-table-column>
      <el-table-column label="启用">
        <template #default="scope">
          <el-switch
              v-model="scope.row.enable"
              @change="changeEnable(scope.row)"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" @click="del(scope.row.id)">删除
            <el-icon>
              <Delete/>
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding:10px 0">
      <el-pagination
          background layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-size="pageSize"
      />
    </div>
  </div>
</template>

<script>
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "file",
  data() {
    return {
      tableData: [],
      headerBg: 'headerBg',
      name: "",
      multipleSelection: [],
      percent: 0,
      total: 0,  // 总数
      pageNum: 1,
      pageSize: 2,
    }
  },
  methods: {
    // 分页查询
    load() {
      this.$api.FilePageQuery(this.pageNum, this.pageSize, this.name).then(response => {
        console.log(response)
        this.tableData = response.data.records
        this.total = response.data.total
      })
    },
    // 删除
    del(id) {
      ElMessageBox.confirm("确认删除!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const response = await this.$api.FileDel(id)
        if (response.code === 200) {
          ElMessage({
            type: "success",
            message: "删除成功"
          })
          await this.load()
        }
      }).catch(() => {
        ElMessage({
          type: "error",
          message: "删除取消"
        })
      })
    },
    //批量删除
    delBatch() {
      let ids = this.multipleSelection.map(v => v.id)
      console.log(ids)// [{},{}] ==> [1,2,3]
      ElMessageBox.confirm("确认删除!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const response = await this.$api.FileDelBatch(ids)
        if (response.code === 200) {
          ElMessage({
            type: "success",
            message: "删除成功"
          })
          await this.load()
        }
      }).catch(() => {
        ElMessage({
          type: "error",
          message: "删除取消"
        })
      })
    },
    // 下载
    download(url) {
      window.open(url)
    },
    // 重置
    reset() {
      this.name = ""
      this.load()
    },
    // 是否可用开关
    changeEnable(row){
      this.$api.updateIsEnable(row).then(res=>{
        if(res.code === 200){
          ElMessage({
            type: "success",
            message: "操作成功"
          })
        }
      })
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum
      this.load()
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    // 导入进图条
    handleUploadProgress(event, file, fileList) {
      this.percent = parseInt(event.percent, 10)
      if (this.percent === 100) {
        ElMessage({type: "success", message: "上传成功"})
      }
      this.load()
    }
  },
  created() {
    this.load()
  }
}
</script>

<style scoped>
.headerBg {
  background: #8fc1f6 !important;
}
</style>