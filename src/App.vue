<template>

  <router-view/>

</template>
<script>
export default {
  created() {
    // 页面刷新将vuex里的信息保存到sessionStorage
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('messageStore', JSON.stringify(this.$store.state))
    })
    // 页面加载时读取sessionStorage的状态信息
    sessionStorage.getItem('messageStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(sessionStorage.getItem('messageStore'))))
  }
}
</script>
<style>
</style>
