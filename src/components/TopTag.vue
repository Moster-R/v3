<template>
  <div class="box">
    <div class="tag" style="height:30px;line-height:30px">
    <span v-for="tag in tags">
      <el-tag v-if="tag.path === $route.path"
              effect="dark"
              type="success"
              style="cursor: pointer;margin-left:10px"
              @click="clickTag(tag)">
        {{ tag.meta.name }}
      </el-tag>
      <el-tag v-else
              type="success"
              closable
              style="cursor: pointer;margin-left:10px"
              @click="clickTag(tag)"
              @close="closeTag(tag)">
        {{tag.meta.name}}
      </el-tag>
    </span>
    </div>

  </div>
</template>

<script>
import {mapMutations, mapState} from "vuex";

export default {
  name: "TopTag",
  computed: {
    ...mapState(['tags'])
  },
  methods: {
    ...mapMutations(['delTags']),
    clickTag(tag) {
      this.$router.push(tag)
    },
    closeTag(tag) {
      this.delTags(tag)
    }
  }
}
</script>

<style scoped>

</style>