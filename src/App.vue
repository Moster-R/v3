<template>

  <router-view/>
  <div id="app">
    <meting-js server="netease" type="playlist" id="2677814952" fixed="true" autoplay="true" loop="all" order="list"
               preload="auto" list-folded="true" list-max-height="500px" lrc-type="1">
    </meting-js>
  </div>

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
