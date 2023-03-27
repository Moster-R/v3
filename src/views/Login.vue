<template>
  <div class="login-body">
    <div class="login-data">
      <div class="login-text">
        <img src="../assets/img/logo2.png">
      </div>
      <div class="form-data">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item label="账号" prop="username">
            <el-input v-model="form.username" clearable placeholder="请输入账号">
              <template #prefix>
                <el-icon size="20"><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" @keydown.enter="login" clearable placeholder="请输入密码" show-password>
              <template #prefix>
                <el-icon size="20">
                  <Lock/>
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="tool">
        <div>
          <el-checkbox v-model="checked" @change="remenber"
          >记住密码
          </el-checkbox
          >
        </div>
        <div>
          <span class="shou" @click="this.dialogFormVisible=true">忘记密码？</span>
        </div>
      </div>
      <div class="butt">
        <el-button type="primary" @click.native.prevent="login()"
        >登录
        </el-button
        >
        <el-button class="shou" @click="register">注册</el-button>
      </div>
    </div>

    <!-- 找回密码 -->
    <el-dialog @close="clearForm" title="忘记密码" v-model="dialogFormVisible" width="40%" style="height:300px">
      <el-form :model="findPasswordForm" ref="ruleFormRef" :rules="rules" label-width="60px">
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input placeholder="请填写邮箱" v-model="findPasswordForm.email">
            <template #prefix>
              <el-icon size="20"><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
          <el-input placeholder="请填写 6-18 位密码" type="password" maxlength="18" v-model="findPasswordForm.password" show-password>
            <template #prefix>
              <el-icon size="20"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="验证码" :label-width="formLabelWidth" prop="code">
          <el-input placeholder="请填写6位数字验证码" type="number" maxlength="6" v-model="findPasswordForm.code">
            <template #prefix>
              <el-icon size="20"><Key /></el-icon>
            </template>
            <template v-slot:append>
              <el-button  @click="sendEmailCode()" :disabled="disabled">{{ msg }}</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="float: right">
        <el-button type="danger" :loading="loading" @click="forgetpas('findPasswordForm')">提 交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import CryptoJS from 'crypto-js' //加密js
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: ""
      },
      findPasswordForm:{
        email: '',
        password: '',
        code: ''
      },
      checked: false,
      rules: {
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
          {max: 22, message: "不能大于10个字符", trigger: "blur"},
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {max: 10, message: "不能大于10个字符", trigger: "blur"},
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: 'blur' }
        ],
        code: [
          { required: true, message: "请输入验证码",trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      dialogFormVisible:false,
      loading: false,
      // 倒计时
      disabled: false,
      msg: '点击获取验证码',
      count: 60,
      timer: 0,
    };
  },
  methods: {
    // 登录
    login() {
      this.$refs.form.validate(async valid => {
        if (valid) {
         await this.$api.login(this.form)
              .then((res) => {
                if (res.code===200){
                  // setToken(res.data.token);
                  console.log(res.data)
                  localStorage.setItem("userInfo",  JSON.stringify(res.data));
                  this.$store.commit('addUserInfo',res.data);
                  this.$message({
                    message: "登录成功啦😄🎉🎉🎉🎉",
                    type: "success",
                    showClose: true,
                  });
                  this.$router.replace("/");
                } else {
                  this.$message({
                    message: "账户名或密码错误",
                    type: "error",
                    showClose: true,
                  });
                }
              })
              .catch((err) => {
                this.$message({
                  message: "账户名或密码错误",
                  type: "error",
                  showClose: true,
                });
              });
        } else {
          return false;
        }
      });
    },
    // 记住密码
    remenber() {
      if (this.checked) {
        // localStorage.setItem("news", JSON.stringify(this.form))
        this.setCookies(this.form.username,this.form.password,1)
        const userInfo = JSON.stringify(this.form)
        window.sessionStorage.setItem("userInfo",userInfo)
      } else {
        this.clearCookie();
        window.sessionStorage.removeItem("userInfo");// localStorage.removeItem("news")
      }
    },
    // 设置cookie
    setCookies(username, password, days) {
      var text = CryptoJS.AES.encrypt(password, 'secret key 123'); // 使用CryptoJS加密
      var saveDays = new Date() // 获取时间
      saveDays.setTime(saveDays.getTime() + 24 * 60 * 60 * 1000 * days); //保存的天数
      // 字符串拼接存入cookie
      window.document.cookie = "username" + "=" + username + ";path=/;saveDays=" + saveDays.toGMTString();
      window.document.cookie = "password" + "=" + text + ";path=/;saveDays=" + saveDays.toGMTString();
    },
    // 读取cookie
    getCookie() {
      if (document.cookie.length > 0) {
        const arr = document.cookie.split(';');
        for (let i = 0; i < arr.length; i++) {
          const arr2 = arr[i].split('='); // 再次切割
          // 这里会切割出以username为第0项的数组、以password为第0项的数组，判断查找相对应的值
          if (arr2[0] === 'username') {
            this.form.username = arr2[1]; // 拿到账号
          } else if (arr2[0] === 'password') {
            // 拿到加密后的密码arr2[1]并解密
            const bytes = CryptoJS.AES.decrypt(arr2[1].toString(), 'secret key 123');
            // 拿到解密后的密码
            this.form.password = bytes.toString(CryptoJS.enc.Utf8);
          }
        }
      }
    },
    // 清除cookie
    clearCookie() {
      // this.setCookies("", "", 0); //账号密码置空，天数置0
      const temp = document.cookie.split(';');
      let name;
      for (let i = 0; ; i++) {
        if (!temp[i]) break
        name = temp[i].split('=')[0]
        var exp = new Date()
        exp.setTime(exp.getTime() - 1)
        document.cookie = name + "= ''" + '; expires=' + exp.toGMTString()
      }
    },

    forgetpas() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (valid) {
          this.loading = true
          // 请求
          this.$api.findPassword(this.findPasswordForm).then(res=>{
            if(res.code === 200){
              // 请求成功
              this.$message({
                message: '找回密码成功',
                type:'success'
              })
              this.dialogFormVisible = false
              // 刷新页面
              this.$router.push('/login')
            }else{
              // 请求失败
              this.$message({
                message: res.message,
                type:'error'
              })
            }
          }).finally(_=>{
            // 关闭loading
            this.loading = false
          })
        }
      })
      // this.$message({
      //   type: "info",
      //   message: "功能尚未开发额😥",
      //   showClose: true
      // })
    },
    // 获取验证码
    sendEmailCode() {
      this.$refs.ruleFormRef.validateField('email', result => {
        if(result) {
          // 按钮倒计时
          this.disabled = true;
          this.msg = this.count-- + 's后重新获取';
          this.timer = setInterval(() => {
            this.msg = this.count-- + 's后重新获取';
            if (this.count < 0) {
              this.msg = '点击获取验证码';
              this.count = 60;
              this.disabled = false;
              clearInterval(this.timer);
            }
          }, 1000);

          // 发送验证码请求
          this.$api.getRequestCode(this.findPasswordForm.email).then(_ => {
            this.$api.getEmailCode(this.findPasswordForm.email, _.data).then(_ => {
              if(_) {
                // 通知邮箱发送
                this.$notify({
                  title: '邮箱验证码已发送',
                  message: '验证码有效时长5分钟, 失效请重新发送',
                  type: 'success',
                  duration: 10 * 1000
                })
              }
            })
          })
        }
      });
    },
    // 表单重置
    clearForm() {
      if (this.$refs['ruleFormRef'] !== undefined) {
        this.$refs['ruleFormRef'].resetFields()
      }
    },
    register() {
      this.$router.push({name:'Register'})
    },
  },
  created() {
    // 检查本地存储中是否存在名为 "userIfo" 的数据，如果存在，则将其解析为 JSON 格式并赋值给当前对象的 "form" 属性，同时将 "checked" 属性设置为 true。
    const userIfo = window.localStorage.getItem('userInfo')
    if (userIfo) {
      this.form = JSON.parse(userIfo)
      this.checked = true
    }
  },
};
</script>

<style scoped>
.login-body {
  width: 100%;
  height: 100%;
  min-width: 1000px;
  background-image: url("../assets/img/Loging.jpg");
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  background-repeat: no-repeat;
  position: fixed;
  line-height: 100%;
  padding-top: 150px;
}

.login-text {
  margin-bottom: 20px;
  line-height: 50px;
  text-align: center;
  font-size: 30px;
  font-weight: bolder;
  color: white;
  text-shadow: 2px 2px 4px #000000;
}

.login-data {
  width: 400px;
  height: 300px;
  transform: translate(-50%);
  margin-left: 50%;
}

.tool {
  display: flex;
  line-height:29px;
  justify-content: space-between;
  color: #606266;
}

.butt {
  margin-top: 10px;
  text-align: center;
}

.shou {
  cursor: pointer;
  color: #606266;
  font-size:14px;
}

/*ui*/
/* /deep/ .el-form-item__label {
  font-weight: bolder;
  font-size: 15px;
  text-align: left;
}

/deep/ .el-button {
  width: 100%;
  margin-bottom: 10px;

} */
</style>



