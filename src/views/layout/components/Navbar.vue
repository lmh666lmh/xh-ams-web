<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb />
    <div class="cash-pool">
      <span>预充款金额：{{ readyChargeMoney | toRMB }}</span>
      <span style="margin-left: 20px;">可提现金额：{{ agencyChargeMoney | toRMB }}</span>
    </div>
    <!--<message class="message-container"/>-->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar" class="user-avatar">
        <i class="el-icon-caret-bottom"/>
        <span class="nav-text">代理商账号：{{ account }}</span>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/editPassword">
          <el-dropdown-item>
            修改后台密码
          </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/editBookCasePassword">
          <el-dropdown-item>
            修改书柜密码
          </el-dropdown-item>
        </router-link>
        <router-link class="inlineBlock" to="/payPassword">
          <el-dropdown-item>
            支付密码管理
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { api } from '@/api/index'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import Message from '@/components/Message'

export default {
  components: {
    Breadcrumb,
    Hamburger
    // Message
  },
  data() {
    return {
      readyChargeMoney: 0,
      agencyChargeMoney: 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'account'
    ])
  },
  created() {
    this.getAgentCapital()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        const redirect = decodeURIComponent(this.$route.query.redirect || '/login')
        this.$router.push({ path: redirect })
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    getAgentCapital() {
      api.getAgentCapital().then(res => {
        if (res.code === 10000) {
          this.readyChargeMoney = res.data.readyChargeMoney
          this.agencyChargeMoney = res.data.agencyChargeMoney
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  position: relative;
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  .cash-pool{
    position: absolute;
    top: 0;
    right: 350px;
    font-size: 14px;
    color: #409EFF;
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .message-container{
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 260px;
    top: 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 15px;
        font-size: 12px;
      }
      .nav-text{
        position: relative;
        top: -13px;
        margin-left: 10px;
      }
    }
  }
}
</style>

