<template>
  <el-card style="width: 600px; height:330px">
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
      <el-button type="primary" @click="save" :disabled="!isFormModified" style="float: right;margin-right: 15px;">确定</el-button>
    </div>
  </el-card>

</template>


<script>

import {ElMessage} from "element-plus";
import {mapActions, mapState} from "vuex";

export default {
  name: 'Person',
  data() {
    return {
      form: {},
      initialValues:{},
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
    }
  },
  methods: {
    ...mapActions(['setUserInfo']),
    // 修改个人信息
    save() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (valid) {
          const response = await this.$api.add(this.form)
          if (response.code === 200) {
            ElMessage({
              type: "success",
              message: "修改成功"
            })
            // 清空表单数据和表单验证错误信息，以便下一次修改
            this.setUserInfo({})
            this.dialogVisible = false
            await this.load()
          } else {
            ElMessage({
              type: "warning",
              message: "修改成功"
            })
          }
        }
      })
    },
  },
  computed: {
    // ...mapState({userInfo: state => state.userInfo})
    ...mapState(['userInfo']),
    isFormModified(){
      //检查表单每个字段是否已修改
      for (const key in this.form){
        if (this.form[key] !== this.initialValues[key]){
          return true
        }
      }
      return false
    },
  },
  created() {
    this.form = this.userInfo
    // 复制表单数据以备后续比较
    this.initialValues = Object.assign({}, this.form);
  }
}
</script>

<style>
</style>
