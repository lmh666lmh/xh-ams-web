<template>
  <div class="customer-service-container">
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-circle-plus" @click="add">新增客服</el-button>
    </div>
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="list"
        :cell-style="cellStyle"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="客服姓名" align="center" prop="supportName"/>
        <el-table-column label="联系电话" align="center" prop="supportPhone"/>
        <el-table-column label="微信号" align="center" prop="wechatNumber"/>
        <el-table-column label="已绑定学校" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDialogSchool(scope.row.supportId, 'bind', scope.row.supportName)" >{{ scope.row.bindNum }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit(scope.row.supportId)">修改</el-button>
            <el-button type="text" size="small" @click="remove(scope.row.supportId)">删除</el-button>
            <el-button type="text" size="small" @click="showDialogSchool(scope.row.supportId, 'unBind', scope.row.supportName)">绑定学校</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <div class="tips">
      <p>注：1、如果未添加客服和绑定学校客服，默认联系的客服电话为代理商电话；</p>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :width="dialogFormWidth" @close="closeDialog('form')">
      <el-form ref="form" :model="form" :rules="rules" style="height: 180px;">
        <el-form-item :label-width="formLabelWidth" label="客服姓名" prop="supportName" class="form-item">
          <el-input v-model="form.supportName" class="form-input" size="mini"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="联系电话" prop="supportPhone" class="form-item">
          <el-input v-model="form.supportPhone" class="form-input" size="mini" maxlength="11"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="微信号" prop="wechatNumber" class="form-item">
          <el-input v-model="form.wechatNumber" class="form-input" size="mini"/>
        </el-form-item>
        <el-aside class="wechat-pic">
          <div class="image-box">
            <el-form-item prop="pictureUrl">
              <el-input v-model="form.pictureUrl" style="display: none;"/>
              <el-upload
                :show-file-list="false"
                :http-request="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="domain"
                list-type="picture"
                accept=".jpeg,.png"
                class="avatar-uploader">
                <img v-if="form.pictureUrl" :src="form.pictureUrl" class="avatar">
                <div v-else class="text-icon">
                  <i class="el-icon-upload"/>
                  <div class="el-upload__text">上传微信二维码图片</div>
                </div>
              </el-upload>
            </el-form-item>
            <div v-show="isShowImageProgress" class="upload-mask">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="imageProgress" class="progress-icon"/>
            </div>
          </div>
        </el-aside>
        <p class="pic-tips">*允许上传图片类型（png，jpeg）最大不能超过2MB。</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelCustomerForm('form')">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitCustomerForm('form')">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogTableVisible" :title="dialogTableTitle" :width="dialogTableWidth">
      <div class="table-main">
        <div class="table-header">
          <el-form :inline="true" :model="formDialogInline" size="small" class="demo-form-inline">
            <el-form-item label="当前客服:" class="dialog-form-item">
              <span>{{ dialogTableCustomerName }}</span>
            </el-form-item>
            <el-form-item label="学校名称/账号" class="dialog-form-item" style="position: absolute;top: 0;right: 80px;">
              <el-input v-model="formDialogInline.searchKey" placeholder="请填写" size="mini"/>
            </el-form-item>
            <el-form-item class="dialog-form-item" style="position: absolute;top: 0;right: 20px;">
              <el-button type="primary" size="mini" @click="onSubmit('search')">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-operation">
          <span style="font-size: 12px;color: #797979;margin-right: 20px;">共选择 <span style="color: #579df8;">{{ totalSelectNum }}</span> 条</span>
          <el-button type="success" size="mini" @click="bindSchool('batch')">批量{{ dialogTableBtnText }}</el-button>
        </div>
        <div class="table-body">
          <el-table
            v-loading="listLoadingDialog"
            ref="multipleTable"
            :data="listDialog"
            :cell-style="cellStyle"
            element-loading-text="Loading"
            border
            fit
            highlight-current-row
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              align="center"
              width="55"/>
            <el-table-column align="center" label="序号" width="55">
              <template slot-scope="scope">
                {{ scope.$index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="学校名称" align="center" prop="schoolName"/>
            <el-table-column label="学校账号" align="center" prop="schoolAccount"/>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="bindSchool('single',[listDialog[scope.$index]])">{{ dialogTableBtnText }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-show="totalDialog != 0"><Pagination :total="totalDialog" :page.sync="formDialogInline.pageNum" :limit.sync="formDialogInline.pageSize" @pagination="onSubmit"/></div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="cancelCustomerTable">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as qiniu from 'qiniu-js'
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'
import { regPhone } from '@/utils/validate'

export default {
  name: 'CustomerService',
  components: {
    Pagination
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        if (!regPhone(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    return {
      list: null,
      listLoading: true,
      total: 0,
      listDialog: null,
      listLoadingDialog: true,
      totalDialog: 0,
      isShowImageProgress: false,
      imageProgress: 0,
      domain: 'https://upload.qiniup.com',
      imageUrl: 'http://img.qn.xiaohebook.com',
      formInline: {
        pageNum: 1,
        pageSize: 10
      },
      formDialogInline: {
        supportId: '',
        searchKey: '',
        pageNum: 1,
        pageSize: 10
      },
      form: {
        supportName: '',
        supportPhone: '',
        wechatNumber: '',
        pictureUrl: ''
      },
      supportId: null, // 编辑客服弹窗需要
      rules: {
        supportName: [
          { required: true, message: '请输入客服姓名', trigger: 'blur' }
        ],
        supportPhone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        wechatNumber: [
          { required: true, message: '请输入客服微信号', trigger: 'blur' }
        ],
        pictureUrl: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      },
      dialogFormTitle: '新增客服',
      dialogFormWidth: '500px',
      dialogFormVisible: false,
      dialogTableTitle: '绑定学校',
      dialogTableWidth: '700px',
      dialogTableVisible: false,
      formLabelWidth: '90px',
      multipleSelection: [],
      totalSelectNum: 0,
      dialogTableType: null, // 当前弹窗类型 bind:绑学校 unBind:解绑学校
      dialogTableCustomerName: '',
      dialogTableBtnText: '解绑'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getCustomerList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    fetchDialogBindData() {
      this.listLoadingDialog = true
      api.getBindSchoolList(this.formDialogInline).then(response => {
        this.totalDialog = response.data.total
        this.listDialog = response.data.list
        this.listLoadingDialog = false
      }).catch(() => {
        this.listLoadingDialog = false
      })
    },
    fetchDialogUnBindData() {
      this.listLoadingDialog = true
      api.getUNBindSchoolList(this.formDialogInline).then(response => {
        this.totalDialog = response.data.total
        this.listDialog = response.data.list
        this.listLoadingDialog = false
      }).catch(() => {
        this.listLoadingDialog = false
      })
    },
    onSubmit(type) {
      if (type === 'search') {
        this.formDialogInline.pageNum = 1
      }
      if (this.dialogTableType === 'bind') {
        this.fetchDialogBindData()
      } else {
        this.fetchDialogUnBindData()
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    add() {
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增客服'
      this.supportId = null
    },
    edit(supportId) {
      this.dialogFormVisible = true
      this.dialogFormTitle = '客服修改'
      this.supportId = supportId
      api.getCustomerDetail({
        supportId: supportId
      }).then(res => {
        if (res.code === 10000) {
          this.form.supportName = res.data.supportName
          this.form.supportPhone = res.data.supportPhone
          this.form.wechatNumber = res.data.wechatNumber
          this.form.pictureUrl = res.data.pictureUrl
        }
      }).catch(err => {
        console.log(err)
      })
    },
    remove(supportId) {
      this.$confirm('您确定要删除当前客服？（删除后，将解绑当前客服所有绑定的学校！）', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteCustomer({
          supportId: supportId
        }).then(res => {
          if (res.code === 10000) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    },
    cancelCustomerForm(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields()
    },
    submitCustomerForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.supportId) {
            api.editCustomer({
              ...this.form,
              ...{ supportId: this.supportId }
            }).then(res => {
              if (res.code === 10000) {
                this.dialogFormVisible = false
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
              console.log(err)
            })
          } else {
            api.addCustomer(this.form).then(res => {
              if (res.code === 10000) {
                this.dialogFormVisible = false
                this.$message({
                  message: '新增成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        }
      })
    },
    cancelCustomerTable() {
      this.dialogTableVisible = false
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
      this.totalSelectNum = val.length
    },
    getTableSchool(type) {
      if (type === 'bind') {
        this.fetchDialogBindData()
      } else {
        this.fetchDialogUnBindData()
      }
    },
    showDialogSchool(supportId, type, supportName) {
      this.dialogTableType = type
      this.formDialogInline.supportId = supportId
      this.dialogTableCustomerName = supportName
      this.formDialogInline.searchKey = ''
      this.formDialogInline.pageNum = 1
      if (type === 'bind') {
        this.dialogTableBtnText = '解绑'
        this.dialogTableTitle = '已绑定学校'
      } else {
        this.dialogTableBtnText = '绑定'
        this.dialogTableTitle = '绑定学校'
      }
      this.getTableSchool(type)
      this.dialogTableVisible = true
    },
    bindSchool(type, rows) {
      const arr = []
      if (type === 'batch' && this.multipleSelection.length === 0) {
        this.$message('请先选择学校')
        return
      } else if (type === 'single') {
        this.toggleSelection(rows)
      }
      this.multipleSelection.forEach((val, index) => {
        arr.push(val.schoolId)
      })
      if (this.dialogTableType === 'bind') {
        this.customerUNBindSchool(arr)
      } else {
        this.customerBindSchool(arr)
      }
    },
    customerBindSchool(schoolIds) {
      api.customerBindSchool({
        ...{ supportId: this.formDialogInline.supportId },
        schoolId: schoolIds
      }).then(res => {
        if (res.code === 10000) {
          this.dialogTableVisible = false
          this.$message({
            message: '绑定成功！',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    customerUNBindSchool(schoolIds) {
      api.customerUNBindSchool({
        schoolId: schoolIds
      }).then(res => {
        if (res.code === 10000) {
          this.dialogTableVisible = false
          this.$message({
            message: '解绑成功！',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    toggleSelection(rows) {
      this.$refs.multipleTable.clearSelection()
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      }
    },
    handleAvatarSuccess(req) {
      const that = this
      this.isShowImageProgress = true
      const keyName = req.file.name
      // 从后端获取上传凭证token
      api.getToken({
        type: 'img',
        key: keyName
      }).then(res => {
        if (res.code === 10000) {
          const formdata = new FormData()
          formdata.append('file', req.file)
          formdata.append('token', res.data.token)
          formdata.append('key', keyName)
          // 获取到凭证之后再将文件上传到七牛云空间
          const config = {
            useCdnDomain: true,
            region: qiniu.region.z0
          }
          const putExtra = {
            mimeType: ['image/png', 'image/jpeg'] || null
          }
          const observe = {
            next(res) {
              that.imageProgress = parseInt(res.total.percent)
            },
            error(err) {
              that.isShowImageProgress = false
              console.log(err)
            },
            complete(res) {
              // 上传成功以后会返回key 和 hash  key就是文件名了！
              that.isShowImageProgress = false
              that.form.pictureUrl = that.imageUrl + '/' + res.key + '?' + new Date().getTime()
            }
          }
          const observable = qiniu.upload(req.file, keyName, res.data.token, putExtra, config)
          observable.subscribe(observe)
        } else {
          that.isShowImageProgress = false
          this.$message.error('授权失败，请稍后重试')
        }
      })
    },
    beforeAvatarUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 2
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt1M
    }
  }
}
</script>

<style>
  .customer-service-container{
    margin: 20px;
  }
  .customer-service-container .operation-container{
    margin-bottom: 20px;
  }
  .customer-service-container .tips {
    color: #888;
    font-size: 12px;
    margin-top: 10px;
  }
  .customer-service-container .tips p{
    padding: 0;
    margin-top: 0;
  }
  .customer-service-container .pic-tips{
    width: 190px;
    font-size: 12px;
    position: absolute;
    top: 185px;
    right: 10px;
  }
  .customer-service-container .el-dialog__body{
    padding-top: 0;
    padding-bottom: 0;
  }
  .customer-service-container .el-form-item__error{
    top: 85%;
  }
  .customer-service-container .form-item{
    margin-bottom: 10px;
  }
  .customer-service-container .form-input{
    width: 150px;
  }
  /*微信客服二维码样式*/
  .customer-service-container .avatar-uploader {
    border: 1px solid #67c23a;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 130px;
    height: 130px;
  }
  .customer-service-container .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .customer-service-container .avatar {
    max-width: 130px;
    max-height: 130px;
    display: block;
    position: absolute;
    overflow: hidden;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .customer-service-container .text-icon{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .customer-service-container .el-icon-upload{
    font-size: 36px;
    margin-top: 30px;
    color: #409EFF;
  }
  .customer-service-container .el-upload__text{
    font-size: 12px;
    margin-top: -20px;
    color: #409EFF;
  }
  .customer-service-container .image-box{
    position: relative;
    height: 135px;
    overflow: hidden;
  }
  .customer-service-container .upload-mask{
    position: absolute;
    width: 130px;
    bottom: -5px;
    right: 170px;
    overflow: hidden;
  }
  .customer-service-container .progress-icon{
    position: absolute;
    width: 130px;
  }
  .customer-service-container .el-upload__tip{
    color: #ccc;
  }
  .customer-service-container .wechat-pic{
    position: absolute;
    top: 50px;
    right: -100px;
    height: 130px;
    z-index: 999;
    overflow: hidden;
  }
  .customer-service-container .table-main{
    max-height: 350px;
  }
  .customer-service-container .table-header{
    height: 50px;
  }
  .customer-service-container .table-operation{
    margin-top: -10px;
    margin-bottom: 10px;
  }
  .customer-service-container .table-body{
    padding-top: 5px;
    max-height: 260px;
    box-sizing: border-box;
    overflow: auto;
  }
  .customer-service-container .demo-form-inline{
    position: relative;
  }
  .customer-service-container .dialog-form-item{
    margin: 0;
  }
</style>
