<template>
  <div class="forgetPwd-container">
    <el-steps :active="active" finish-status="success">
      <el-step title="身份验证" />
      <el-step title="设置新密码" />
      <el-step title="完成" />
    </el-steps>
    <div v-if="active == 0" class="step-one">
      <el-form ref="form1" :model="form1" :rules="rules1" label-width="100px" status-icon>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form1.phone" placeholder="输入手机号" style="width: 225px;"/>
        </el-form-item>
        <el-form-item label="填写验证码" prop="code">
          <el-input v-model="form1.code" placeholder="填写验证码" style="width: 110px;"/>
          <el-button type="success">获取验证码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-if="active == 1" class="step-two">
      <el-form ref="form2" :model="form2" :rules="rules2" label-width="100px" status-icon>
        <el-form-item label="填写新密码" prop="newPwd">
          <el-input v-model="form2.newPwd" placeholder="填写新密码" type="password" style="width: 225px;"/>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPwd">
          <el-input v-model="form2.confirmNewPwd" placeholder="确认新密码" type="password" style="width: 225px;"/>
        </el-form-item>
        <span style="font-size: 13px;color: #ccc; margin-left: 20px;">密码为6-16位数字+字母组合</span>
      </el-form>
    </div>
    <div v-if="active == 2" class="step-three">
      <span>设置密码成功</span>
    </div>
    <el-button v-show="active < 2" style="margin-top: 12px; margin-left: 20px;" type="success" @click="next">下一步</el-button>
  </div>
</template>

<script>
export default {
  name: 'ForgetPassword',
  data() {
    const phone = (rule, value, callback) => {
      const regPhone = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (value === '') {
        callback(new Error('请填写手机号码'))
      } else {
        if (!regPhone.test(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    const validatePass = (rule, value, callback) => {
      const regPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!regPass.test(value)) {
          callback(new Error('密码为6-16位数字+字母组合'))
        } else {
          callback()
        }
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form2.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      active: 0,
      form1: {
        phone: '',
        code: '',
        newPwd: '',
        confirmNewPwd: ''
      },
      form2: {
        newPwd: '',
        confirmNewPwd: ''
      },
      rules1: {
        phone: [
          { required: true, validator: phone, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请填写手机验证码', trigger: 'blur' }
        ]
      },
      rules2: {
        newPwd: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmNewPwd: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    next() {
      let formName = ''
      if (this.active === 0) {
        formName = 'form1'
      } else if (this.active === 1) {
        formName = 'form2'
      }
      console.log(this.active)
      if (this.active < 2) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(1)
          } else {
            return false
          }
        })
      }
      if (this.active++ > 2) this.active = 0
    }
  }
}
</script>

<style scoped>
.forgetPwd-container{
  width: 70%;
  margin: 20px auto;
}
.step-one, .step-two, .step-three{
  margin-top: 20px;
}
</style>
