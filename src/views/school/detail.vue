<template>
  <div class="edit-container">
    <el-form ref="form" :model="formInline" :rules="rules" :disabled="disabled" label-width="100px" size="small">
      <el-form-item label="学校名称" prop="schoolName">
        <el-input v-model="formInline.schoolName" maxlength="25"/>
      </el-form-item>
      <el-form-item label="学校账号" prop="schoolAccount">
        <el-input v-model="formInline.schoolAccount" :disabled="isDisabled" maxlength="11"/>
      </el-form-item>
      <el-form-item label="学校密码" prop="pwd">
        <el-input v-model="formInline.pwd" type="password" maxlength="255" @change="isChangePwd=true"/>
      </el-form-item>
      <el-form-item label="园长姓名" prop="leaderName">
        <el-input v-model="formInline.leaderName" maxlength="50"/>
      </el-form-item>
      <el-form-item label="联系方式" prop="leaderPhone">
        <el-input v-model="formInline.leaderPhone" maxlength="11"/>
      </el-form-item>
      <el-form-item label="对接老师姓名">
        <el-input v-model="formInline.icTeacherName" maxlength="100"/>
      </el-form-item>
      <el-form-item label="对接老师电话" prop="icTeacherPhone">
        <el-input v-model="formInline.icTeacherPhone" maxlength="11"/>
      </el-form-item>
      <el-form-item label="城市区域">
        <el-select v-model="formInline.provinceId" style="width: 130px;" @change="getCity(formInline.provinceId)">
          <el-option value="">请选择</el-option>
          <el-option
            v-for="item in provinceOptions"
            :key="item.provinceId"
            :label="item.provinceName"
            :value="item.provinceId" />
        </el-select>
        <el-select v-model="formInline.cityId" style="width: 130px;" @change="getCountry(formInline.cityId)">
          <el-option value="">请选择</el-option>
          <el-option
            v-for="item in cityOptions"
            :key="item.cityId"
            :label="item.cityName"
            :value="item.cityId" />
        </el-select>
        <el-select v-model="formInline.countryId" style="width: 130px;" @change="getCountryName(formInline.countryId)">
          <el-option value="">请选择</el-option>
          <el-option
            v-for="item in countryOptions"
            :key="item.countryId"
            :label="item.countryName"
            :value="item.countryId" />
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input v-model="formInline.address" maxlength="100"/>
      </el-form-item>
      <el-form-item v-show="type != 'detail'">
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <el-button v-show="type == 'detail'" size="small" style="margin-left: 10px;" @click="cancel">返回</el-button>
    <div class="tips">
      <p>注：1、学校账号/密码用于书柜登录使用；</p>
      <p style="text-indent: 1.5rem;">2、对接老师目的是方便异常处理时联系老师，建议填写；</p>
    </div>
  </div>
</template>

<script>
import { api } from '@/api/index'
import { regPhone } from '@/utils/validate'

export default {
  name: 'SchoolDetail',
  data() {
    const checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('此项必填'))
      } else {
        if (!regPhone(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    const checkTeacherPhone = (rule, value, callback) => {
      if (value !== '') {
        if (!regPhone(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const checkPwd = (rule, value, callback) => {
      const regPwd = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.isChangePwd) {
          if (!regPwd.test(value)) {
            callback(new Error('密码为6-16位数字+字母组合'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    return {
      count: 0,
      schoolId: '',
      type: '',
      isChangePwd: false,
      disabled: false,
      isDisabled: false,
      oldPwd: null,
      formInline: {
        schoolName: '',
        schoolAccount: '',
        pwd: '',
        leaderName: '',
        leaderPhone: '',
        icTeacherName: '',
        icTeacherPhone: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        countryId: '',
        countryName: '',
        address: ''
      },
      provinceOptions: [],
      cityOptions: [],
      countryOptions: [],
      rules: {
        schoolName: [
          { required: true, message: '请输入学校名称', trigger: 'blur' }
        ],
        schoolAccount: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        pwd: [
          { required: true, validator: checkPwd, trigger: 'blur' }
        ],
        leaderName: [
          { required: true, message: '请输入园长姓名', trigger: 'blur' }
        ],
        leaderPhone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        icTeacherPhone: [
          { required: false, validator: checkTeacherPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getProvince()
    this.schoolId = this.$route.query.schoolId
    this.type = this.$route.query.type
    if (this.type === 'edit' || this.type === 'detail') {
      this.getSchoolDetail(this.schoolId)
      this.isDisabled = true
    }
    if (this.type === 'detail') {
      this.disabled = true
    }
  },
  methods: {
    getSchoolDetail(schoolId) {
      api.getSchoolDetail(schoolId).then(response => {
        if (response.code === 10000) {
          this.isChangePwd = false
          for (const key in this.formInline) {
            this.formInline[key] = response.data[key]
            if (key === 'provinceId') {
              this.getCity(response.data.provinceId)
            } else if (key === 'cityId') {
              this.getCountry(response.data.cityId)
            }
          }
          this.count++
        } else {
          this.$message.error('获取学校详情失败')
        }
      })
    },
    getProvinceName(val) {
      let obj = {}
      obj = this.provinceOptions.find((item) => {
        return item.provinceId === val
      })
      this.formInline.provinceName = obj.provinceName
      console.log('省：' + this.formInline.provinceName)
    },
    getCityName(val) {
      let obj = {}
      obj = this.cityOptions.find((item) => {
        return item.cityId === val
      })
      this.formInline.cityName = obj.cityName
      console.log('市：' + this.formInline.cityName)
    },
    getCountryName(val) {
      let obj = {}
      obj = this.countryOptions.find((item) => {
        return item.countryId === val
      })
      this.formInline.countryName = obj.countryName
      console.log('区：' + this.formInline.countryName)
    },
    getProvince() {
      api.getProvince().then(response => {
        this.provinceOptions = response.data
      }).catch((err) => {
        console.log(err)
      })
    },
    getCity(provinceId) {
      if (provinceId !== '') {
        api.getCity(provinceId).then(response => {
          this.count++
          if ((this.type === 'edit' || this.type === 'detail') && (this.count < 4 && this.count > 0)) {
            console.log('city')
          } else {
            this.formInline.cityId = ''
            this.formInline.countryId = ''
            this.formInline.cityName = ''
            this.formInline.countryName = ''
            this.countryOptions = []
          }
          this.cityOptions = response.data
          this.getProvinceName(provinceId)
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.formInline.cityId = ''
        this.formInline.countryId = ''
        this.formInline.provinceName = ''
        this.formInline.cityName = ''
        this.formInline.countryName = ''
        this.cityOptions = []
        this.countryOptions = []
      }
    },
    getCountry(cityId) {
      if (cityId !== '') {
        api.getCountry(cityId).then(response => {
          this.count++
          if ((this.type === 'edit' || this.type === 'detail') && (this.count < 4 && this.count > 0)) {
            console.log('county')
          } else {
            this.formInline.countryId = ''
            this.formInline.countryName = ''
          }
          this.countryOptions = response.data
          this.getCityName(cityId)
        }).catch((err) => {
          console.log(err)
        })
      } else {
        this.formInline.countryId = ''
        this.formInline.cityName = ''
        this.formInline.countryName = ''
        this.countryOptions = []
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.oldPwd = this.formInline.pwd
          if ((this.type === 'edit' && this.isChangePwd) || this.type === 'add') {
            this.formInline.pwd = this.$getCode(this.formInline.pwd)
          }
          this.formInline.schoolId = this.schoolId
          if (this.type === 'add') {
            api.addSchool(this.formInline).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
                this.$router.push({
                  path: '/school'
                })
              } else {
                this.formInline.pwd = this.oldPwd
                this.$message.error('修改失败')
              }
            }).catch(() => {
              this.formInline.pwd = this.oldPwd
              loading.close()
            })
          } else {
            api.editSchool(this.formInline).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
                this.$router.push({
                  path: '/school'
                })
              } else {
                this.formInline.pwd = this.oldPwd
                this.$message.error('修改失败')
              }
            }).catch(() => {
              this.formInline.pwd = this.oldPwd
              loading.close()
            })
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
.edit-container{
  width: 520px;
  padding: 10px;
}
.edit-container .tips {
  color: #888;
  font-size: 12px;
  margin-top: 10px;
}
.edit-container .tips p{
  padding: 0;
  margin-top: 0;
}
</style>
