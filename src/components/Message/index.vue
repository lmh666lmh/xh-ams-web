<template>
  <i class="el-icon-message message" @click="toMessage('/message')">
    <span v-if="messageNumber > 99">99+</span>
    <span v-else v-show="messageNumber != 0">{{ messageNumber }}</span>
  </i>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Message',
  computed: {
    ...mapGetters([
      'messageNumber'
    ])
  },
  created() {
    this.$store.dispatch('ChangeMessageNumber')
  },
  methods: {
    toMessage(path) {
      this.$router.push({
        path: path
      })
      this.$store.dispatch('ChangeMessageNumber', '0')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.message{
  position: relative;
  top: 10px;
  font-size: 30px;
  cursor: pointer;
  span{
    display: inline-block;
    position: absolute;
    top: -5px;
    left: 20px;
    padding: 2px 10px;
    background-color: #E5A23C;
    font-size: 12px;
    color: #fff;
    border-radius: 10px;
  }
}
</style>
