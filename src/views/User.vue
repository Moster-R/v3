<template>
  <div>
    <div style="padding:5px 0">
      <el-input style="width:240px" v-model="username" placeholder="请输入名称">
        <template #suffix>
          <el-icon>
            <Search/>
          </el-icon>
        </template>
      </el-input>
      <el-input style="width:240px" v-model="email" placeholder="请输入邮箱">
        <template #suffix>
          <el-icon>
            <Message/>
          </el-icon>
        </template>
      </el-input>
      <el-input style="width:240px" v-model="address" placeholder="请输入地址">
        <template #suffix>
          <el-icon>
            <Location/>
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" style="margin-left:5px" @click="load()">搜索</el-button>
      <el-button type="warning" style="margin-left:5px" @click="reset">重置</el-button>
    </div>
    <div style="margin:10px 0">
      <el-button type="primary" @click="resetForm">新增
        <el-icon :size="14" style="margin-left:5px">
          <CirclePlusFilled/>
        </el-icon>
      </el-button>
      <el-button type="danger" :disabled="multipleSelection.length===0" @click="delBatch">批量删除
        <el-icon :size="14" style="margin-left:5px">
          <DeleteFilled/>
        </el-icon>
      </el-button>
      <el-button type="primary" @click="leadOut" style="margin-left: 10px">导出
        <el-icon :size="16" style="margin-left:5px">
          <Download/>
        </el-icon>
      </el-button>
      <el-upload action="http://localhost:8466/user/upload"
                 :show-file-list="false"
                 accept="xlsx"
                 :on-progress="handleUploadProgress"
                 style="display:inline-block;margin-left:10px;">
        <el-button type="primary">导入
          <el-icon :size="16" style="margin-left:5px">
            <UploadFilled/>
          </el-icon>
        </el-button>
      </el-upload>
      <el-progress :percentage="percent"></el-progress>
    </div>
    <el-table :data="tableData"
              border
              stripe
              :header-cell-class-name="headerBg"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="id" label="ID" width="80"/>
      <el-table-column prop="username" label="用户名" width="140"/>
      <el-table-column prop="nickname" label="昵称" width="120"/>
      <el-table-column prop="email" label="邮箱"/>
      <el-table-column prop="phone" label="电话" width="180"/>
      <el-table-column prop="address" label="地址"/>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="success" @click="modify(scope.row)">编辑
            <el-icon>
              <Edit/>
            </el-icon>
          </el-button>
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
    <el-dialog title="新增" v-model="dialogVisible" width="40%" style="height: 400px">
      <el-form :model="form" :rules="rule" ref="ruleFormRef">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false" style="float: right">取消</el-button>
        <el-button type="primary" @click="increase" style="float: right;margin-right: 15px;">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {ElMessage, ElMessageBox} from "element-plus";

let handleExcelImport;
export default {
  name: "User",
  data() {
    return {
      tableData: [], // 渲染数据源
      form: {
        username: "",
        nickname: "",
        email: "",
        phone: "",
        address: "",
      },
      username: "",
      email: "",
      address: "",
      total: 0,  // 总数
      pageNum: 1,
      pageSize: 2,
      multipleSelection: [],
      dialogVisible: false,
      formLabelWidth: '120px',
      rule: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: 'blur'
          }
        ],
        nickname: [{
          required: true,
          message: "请输入昵称",
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: "请输入邮箱",
          trigger: 'blur'
        }],
        phone: [{
          required: true,
          message: "请输入联系方式",
          trigger: 'blur'
        }],
        address: [{
          required: true,
          message: "请输入地址",
          trigger: 'blur'
        }]
      },
      headerBg: 'headerBg',
      percent: 0
    }
  },
  methods: {
    // 分页查询
    load() {
      this.$api.pageQuery(this.pageNum, this.pageSize, this.username, this.email, this.address).then(response => {
        console.log(response)
        this.tableData = response.records
        this.total = response.total
      })
    },
    // 新增
    increase() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (valid) {
          const response = await this.$api.add(this.form)
          if (response) {
            ElMessage({
              type: "success",
              message: "添加成功"
            })
            this.dialogVisible = false
            await this.load()
          } else {
            ElMessage({
              type: "warning",
              message: "添加失败"
            })
          }
        }
      })
    },
    // 修改
    modify(row) {
      this.form = {...row}
      this.dialogVisible = true
    },
    // 删除
    del(id) {
      ElMessageBox.confirm("确认删除!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const response = await this.$api.del(id)
        if (response) {
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
        const response = await this.$api.delBatch(ids)
        if (response) {
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
    // 导出
    leadOut(){
      window.open("http://localhost:8466/user/export")
    },
    // 重置
    reset() {
      this.username = ""
      this.email = ""
      this.address = ""
    },
    //表单重置
    resetForm() {
      this.dialogVisible = true
      if (this.$refs['ruleFormRef'] !== undefined) {
        this.$refs['ruleFormRef'].resetFields()
      }
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
    handleUploadProgress(event, file, fileList) {
      this.percent = parseInt(event.percent, 10)
      if (this.percent === 100 ){
        ElMessage({type:"success",message: "导入成功"})
        this.load()
      }
    }
  },
  created() {
    this.load()
  }
}
</script>

<style>
.headerBg {
  background: #8fc1f6 !important;
}
.progress1{ display:none;}
.progress{
  display: flex;
  width: 80px;
  height: 80px;
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: transparent;
}
</style>