<template>
  <el-card style="width: 600px; height:500px">
    <el-form :model="form" :rules="rule" ref="ruleFormRef">
      <el-upload
          class="avatar-uploader"
          accept="image/png,image/gif,image/jpg,image/jpeg"
          action="http://localhost:8466/files/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
      >
        <img v-if="form.avatarUrl" :src="form.avatarUrl" class="avatar"/>
        <el-icon v-else class="avatar-uploader-icon">
          <Plus/>
        </el-icon>
      </el-upload>
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input disabled v-model="form.username"></el-input>
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
      <el-button type="primary" @click="save" :disabled="!isFormChanged ||isSaving" :loading="isSaving" style="float: right;margin-right: 15px;">确定
      </el-button>
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
      formLabelWidth: '120px',
      isSaving: false, // 添加一个标志以防止多次提交
      rule: {
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
      // 防止多次提交
      if (this.isSaving) {
        return;
      }
      // 标记为正在提交
      this.isSaving = true;
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (valid) {
          const response = await this.$api.add(this.form)
          if (response.code === 200) {
            // 更新vuex存储的用户信息
            this.setUserInfo(response.data)
            // 更新表单数据为最新数据
            this.form = response.data;
            this.formInit = Object.assign({}, response.data);

            // 重置表单并标记为未修改
            this.$refs.ruleFormRef.resetFields();
            this.isFormChanged = false;
            this.isSaving = false;
            ElMessage({
              type: "success",
              message: "修改成功"
            })
            this.isSaving = false;
          } else {
            ElMessage({
              type: "warning",
              message: "修改失败"
            })
            // 标记为未提交
            this.isSaving = false;
          }
        }
      })
    },
    handleAvatarSuccess(res) {
      this.form.avatarUrl = res.data
    },
  },
  computed: {
    ...mapState(['userInfo']),
      isFormChanged(){
        return JSON.stringify(this.formInit) !== JSON.stringify(this.form)
    },
  },
  created() {
    this.$api.findName(this.userInfo.username).then(response => {
      if (response.code === 200) {
        this.form = response.data
        this.formInit = Object.assign({}, response.data)
        // 将 formInit 的值和 form 的值进行比较
        this.isFormChanged = JSON.stringify(this.formInit) !== JSON.stringify(this.form)
      }
    })

  }
}
</script>

<style>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
