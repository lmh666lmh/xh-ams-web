<template>
  <div class="edit-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item label="原始密码" style="width: 300px;" prop="oldPwd">
        <el-input v-model="form.oldPwd" type="password"/>
      </el-form-item>
      <el-form-item label="输入新密码" style="width: 300px;" prop="newPwd">
        <el-input v-model="form.newPwd" type="password"/>
      </el-form-item>
      <el-form-item label="确认新密码" style="width: 300px;" prop="confirmNewPwd">
        <el-input v-model="form.confirmNewPwd" type="password"/>
      </el-form-item>
      <div class="tips">建议密码长度为8-16个，包含数字、大小写字母和符号</div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { api } from '@/api/index'
import { mapGetters } from 'vuex'

export default {
  name: 'EditPassword',
  data() {
    const password = (rule, value, callback) => {
      const regPhone = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!regPhone.test(value)) {
          callback(new Error('密码为6-16位数字+字母组合'))
        } else {
          callback()
        }
      }
    }
    const checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      id: '',
      listLoading: true,
      form: {
        oldPwd: '',
        newPwd: '',
        confirmNewPwd: ''
      },
      rules: {
        newPwd: [
          { required: true, validator: password, trigger: 'blur' }
        ],
        confirmNewPwd: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ],
        oldPwd: [
          { required: true, message: '请填写原始密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'agentId'
    ])
  },
  created() {
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.oldPwd = this.$getCode(this.form.oldPwd)
          this.form.newPwd = this.$getCode(this.form.newPwd)
          this.form.confirmNewPwd = this.$getCode(this.form.confirmNewPwd)
          api.changePassword({ ...this.form, ...{ agentId: this.agentId }}).then(response => {
            if (response.code === 10000) {
              this.$message({
                message: '密码修改成功！',
                type: 'success'
              })
              setTimeout(() => {
                this.$store.dispatch('LogOut').then(() => {
                  const redirect = decodeURIComponent(this.$route.query.redirect || '/login')
                  this.$router.push({ path: redirect })
                  location.reload() // 为了重新实例化vue-router对象 避免bug
                })
              }, 1500)
            } else {
              this.$message.error('密码修改失败')
            }
          })
        } else {
          return false
        }
      })
    },
    back() {
      history.go(-1)
    }
  }
}
</script>

<style scoped>
.edit-container{
  width: 400px;
  padding: 10px;
}
.tips{
  margin: 0 0 20px 20px;
  color: #ccc;
  font-size: 14px;
}
</style>
