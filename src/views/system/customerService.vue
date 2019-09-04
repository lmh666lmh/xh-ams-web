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
        <el-table-column label="客服姓名" align="center" prop="bookcaseNum"/>
        <el-table-column label="联系电话" align="center" prop="schoolName"/>
        <el-table-column label="微信号" align="center" prop="schoolName"/>
        <el-table-column label="已绑定学校" align="center" prop="schoolName"/>
        <el-table-column label="联系电话" align="center" prop="schoolName"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit">修改</el-button>
            <el-button type="text" size="small" @click="remove">删除</el-button>
            <el-button type="text" size="small">绑定学校</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <div class="tips">
      <p>注：1、如果未添加客服和绑定学校客服，默认联系的客服电话为代理商电话；</p>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :width="dialogFormWidth">
      <el-form ref="form" :model="form" :rules="rules" style="height: 180px;">
        <el-form-item :label-width="formLabelWidth" label="客服姓名" prop="name" class="form-item">
          <el-input v-model="form.name" class="form-input" size="mini"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="联系电话" prop="phone" class="form-item">
          <el-input v-model="form.phone" class="form-input" size="mini"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="微信号" prop="wechat" class="form-item">
          <el-input v-model="form.wechat" class="form-input" size="mini"/>
        </el-form-item>
        <el-aside class="wechat-pic">
          <div class="image-box">
            <el-form-item prop="QRCode">
              <el-input v-model="form.QRCode" style="display: none;"/>
              <el-upload
                :show-file-list="false"
                :http-request="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="domain"
                list-type="picture"
                accept=".jpeg,.png"
                class="avatar-uploader">
                <img v-if="form.QRCode" :src="form.QRCode" class="avatar">
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
        <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="mini" @click="dialogFormVisible = false">保 存</el-button>
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
      isShowImageProgress: false,
      imageProgress: 0,
      domain: 'https://upload.qiniup.com',
      imageUrl: 'http://img.qn.xiaohebook.com',
      formInline: {
        pageNum: 1,
        pageSize: 10
      },
      form: {
        name: '',
        phone: '',
        wechat: '',
        QRCode: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入客服姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        wechat: [
          { required: true, message: '请输入客服微信号', trigger: 'blur' }
        ],
        QRCode: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ]
      },
      dialogFormTitle: '新增客服',
      dialogFormWidth: '500px',
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '90px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getEquipmentBookcaseList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    add() {
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增客服'
    },
    edit() {
      this.dialogFormVisible = true
      this.dialogFormTitle = '客服修改'
    },
    remove() {
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
              that.form.QRCode = that.imageUrl + '/' + res.key + '?' + new Date().getTime()
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
</style>
