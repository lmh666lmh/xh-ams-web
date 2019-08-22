<template>
  <div class="edit-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="small">
      <el-form-item v-if="setPayPwd" label="原始密码" style="width: 300px;" prop="oldPwd">
        <el-input v-model="form.oldPwd" type="password" maxlength="6"/>
      </el-form-item>
      <el-form-item label="输入新密码" style="width: 300px;" prop="newPwd">
        <el-input v-model="form.newPwd" type="password" maxlength="6"/>
      </el-form-item>
      <el-form-item label="确认新密码" style="width: 300px;" prop="confirmNewPwd">
        <el-input v-model="form.confirmNewPwd" type="password" maxlength="6"/>
      </el-form-item>
      <div class="tips">密码为6位数字</div>
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
  name: 'PayPassword',
  data() {
    const password = (rule, value, callback) => {
      const regPwd = /^[0-9]{6}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!regPwd.test(value)) {
          callback(new Error('密码为6数字'))
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
      'setPayPwd'
    ])
  },
  created() {
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.form.newPwd = this.$getCode(this.form.newPwd)
          this.form.confirmNewPwd = this.$getCode(this.form.confirmNewPwd)
          if (this.setPayPwd) {
            this.form.oldPwd = this.$getCode(this.form.oldPwd)
            api.editPayPassword(this.form).then(response => {
              if (response.code === 10000) {
                this.$message({
                  message: '支付密码修改成功！',
                  type: 'success'
                })
                history.go(0)
                this.$refs['form'].resetFields()
              } else {
                this.$message.error('支付密码修改失败！')
                this.$refs['form'].resetFields()
              }
            })
          } else {
            api.addPayPassword({
              newPwd: this.form.newPwd,
              confirmNewPwd: this.form.confirmNewPwd
            }).then(response => {
              if (response.code === 10000) {
                this.$message({
                  message: '支付密码新增成功！',
                  type: 'success'
                })
                history.go(0)
                this.$refs['form'].resetFields()
              } else {
                this.$message.error('支付密码新增失败！')
                this.$refs['form'].resetFields()
              }
            })
          }
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
