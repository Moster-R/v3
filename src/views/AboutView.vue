<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
export default {
  data() {

  },
  mounted() {
    this.name = this.$store.state.name;
    console.log(this.name);
  },
  methods:{
    forgetpas() {
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (valid) {
          this.loading = true
          // 请求
          this.$api.findPassword(this.findPasswordForm).then(_=>{
            if(_){
              // 请求成功
              this.$message({
                message: '密码找回成功',
                type:'success'
              })
              this.dialogFormVisible = false
              // 刷新页面
              this.$router.push('/login')
            }else{
              // 请求失败
              this.$message({
                message: '密码找回失败',
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
      this.$refs.findPasswordForm.validateField('email', result => {
        if(!result) {
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
  }
}
</script>
