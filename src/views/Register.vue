<template>
  <div class="register">
    <div class="register-form">
      <h2>注册</h2>

      <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="70px">

        <el-form-item label="邮箱" prop="email">
          <el-input  placeholder="请填写邮箱" maxlength="32" v-model="registerForm.email" >
            <template #prefix>
              <el-icon size="20"><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input  placeholder="请填写用户名" maxlength="32" v-model="registerForm.username" >
            <template #prefix>
              <el-icon size="20"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input placeholder="请填写 6-18 位密码" type="password" maxlength="18" v-model="registerForm.password" show-password>
            <template #prefix>
              <el-icon size="20"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="passwordConfirm">
          <el-input placeholder="请填写 6-18 位密码" type="password" maxlength="18" v-model="registerForm.passwordConfirm" show-password>
            <template #prefix>
              <el-icon size="20"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="验证码" prop="code">
          <el-input placeholder="请填写6位数字验证码" type="number" maxlength="6" v-model="registerForm.code">
            <template #prefix>
              <el-icon size="20"><Key /></el-icon>
            </template>
            <template v-slot:append>
              <el-button  @click="sendEmailCode()" :disabled="disabled">{{ msg }}</el-button>
            </template>
          </el-input>
<!--          <el-button  @click="sendEmailCode()" :disabled="disabled">{{ msg }}</el-button>-->
        </el-form-item>

        <el-form-item class="btn-r" label-width="0px">
          <el-button type="danger" icon="Promotion" :loading="loading" @click="submitForm('registerForm')">注 册</el-button>
        </el-form-item>

        <el-form-item class="btn-l" label-width="0px">
          <router-link to="/login">
            <el-button type="success" icon="Back">登 录</el-button></router-link>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    var email = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请输入邮箱！'))
      }else if(!/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/.test(value)) {
        return callback(new Error('请输入正确的邮箱！'))
      }else{
        return callback()
      }
    };
    var password = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请输入密码！'))
      }else if(!/(?=.*[a-zA-Z])[a-zA-Z0-9]{6,18}/.test(value)) {
        return callback(new Error("密码长度在6-18个字符，只能包含数字、大小写字母 且 至少包含一个字母！"))
      }else if(this.registerForm.passwordConfirm !== '') {
        this.$refs.registerForm.validateField('passwordConfirm');
        return callback()
      }else {
        return callback()
      }
    };
    var passwordConfirm = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请输入确认密码！'))
      }else if(!/(?=.*[a-zA-Z])[a-zA-Z0-9]{6,18}/.test(value)) {
        return callback(new Error("密码长度在6-18个字符，只能包含数字、大小写字母 且 至少包含一个字母！"))
      }else if(value !== this.registerForm.password) {
        return callback(new Error('两次输入的密码不一致！'))
      }else {
        return callback()
      }
    };
    var code = (rule, value, callback) => {
      if(!value) {
        return callback(new Error('请输入6位验证码！'))
      }else if(value.length !== 6) {
        return callback(new Error('请输入6位验证码！'))
      }else {
        return callback()
      }
    };
    return {
      registerForm: {
        email: '',
        username:'',
        password: '',
        passwordConfirm: '',
        code: ''
      },
      // 倒计时
      disabled: false,
      msg: '点击获取验证码',
      count: 60,
      timer: 0,
      // 按钮加载
      loading: false,
      rules: {
        email: [
          { validator: email, trigger: 'blur' }
        ],
        username: [
          { required: true, message: 'Please input Activity name', trigger: 'blur' },
          { min: 1, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
        ],
        password: [
          { validator: password, trigger: 'blur' }
        ],
        passwordConfirm: [
          { validator: passwordConfirm, trigger: 'blur'}
        ],
        code: [
          { validator: code, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 注册
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$api.register(this.registerForm).then(res => {
            if(res.code === 200) {
              localStorage.setItem("userInfo",  JSON.stringify(res.data));
              // 注册成功
              setTimeout(() => {
                this.$router.push({ path: '/home'})
              }, 500);

              this.$message({
                message: '注册成功',
                type: 'success'
              })
            }else {
              this.$message({
                message: res.message,
                type: 'success'
              })
            }
          }).finally(_ => {
            this.loading = false
          })
        }
      });
    },
    // 获取验证码
    sendEmailCode() {
      this.$refs.registerForm.validateField('email', result => {
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
          // _.data.permissionCode 是怎么来的
          this.$api.getRequestCode(this.registerForm.email).then(_ => {
            this.$api.getEmailCode(this.registerForm.email,_.data).then(_ => {
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
  }
}
</script>

<style scoped>
.register {
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;
  background: azure url('../assets/img/img_1.png') no-repeat fixed;
  background-size: 100% 100%;
}

.register-form {
  height: 400px;
  width: 600px;
  box-sizing: border-box;
  background-color: #fff;
  opacity: 0.8;
  padding: 20px 50px;
}

.register-form input::-webkit-outer-spin-button,
.register-form input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.register-form input[type='number'] {
  -moz-appearance: textfield;
}

.btn-r {
  width: 100px;
  float: right;
}

.btn-l {
  width: 100px;
  float: left;
}
</style>