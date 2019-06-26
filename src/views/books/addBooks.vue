<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" label-width="80px" size="small" style="margin: 20px 0 0 20px;">
      <el-container style="width: 700px;">
        <el-aside width="300px">
          <div style="height: 305px;">
            <el-upload
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              list-type="picture"
              class="avatar-uploader"
              action="111">
              <img v-if="form.bookPic" :src="form.bookPic" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon">上传书本封面</i>
            </el-upload>
          </div>
        </el-aside>
        <el-main>
          <el-form-item label="书本编码" prop="name">
            <el-input v-model="form.bookTemplateId"/>
          </el-form-item>
          <el-form-item label="书名" prop="name">
            <el-input v-model="form.bookName"/>
          </el-form-item>
          <el-form-item label="作者" prop="name">
            <el-input v-model="form.bookAuthor"/>
          </el-form-item>
          <el-form-item label="年龄段" prop="name">
            <el-select v-model="form.ageRange" placeholder="请选择" style="width: 200px;">
              <el-option label="请选择" value=""/>
              <el-option
                v-for="item in ageRangeOptions"
                :key="item.subCode"
                :label="item.subName"
                :value="item.subCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="所属类目" prop="name">
            <el-select v-model="form.bookCategoryCode" placeholder="请选择" style="width: 200px;">
              <el-option label="请选择" value=""/>
              <el-option
                v-for="item in bookCategoryOptions"
                :key="item.subCode"
                :label="item.subName"
                :value="item.subCode" />
            </el-select>
          </el-form-item>
        </el-main>
      </el-container>
      <el-input
        :rows="6"
        v-model="form.bookDesc"
        type="textarea"
        style="width: 680px;margin: 20px 0 20px 0;"
        placeholder="请输入内容" />
      <el-form-item v-show="type != 'detail'" style="margin-left: -80px;margin-top: 20px;">
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button v-show="type == 'detail'" size="small" style="margin-left: 20px;" @click="cancel">返回</el-button>
    </div>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'AddBooks',
  data() {
    return {
      bookTemplateId: '',
      type: '',
      listLoading: true,
      disabled: false,
      form: {
        bookTemplateId: '',
        bookName: '',
        bookAuthor: '',
        bookCategoryCode: '',
        ageRange: '',
        bookDesc: '',
        bookPic: ''
      },
      ageRangeOptions: [],
      bookCategoryOptions: [],
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.bookTemplateId = this.$route.query.bookTemplateId
    this.type = this.$route.query.type
    if (this.type === 'detail') {
      this.disabled = true
      this.getBooksDetail()
    }
    this.getDictionary()
  },
  methods: {
    getDictionary() {
      api.getDictionary('book_category,age_range').then(response => {
        if (response.code === 10000) {
          this.ageRangeOptions = response.data.age_range
          this.bookCategoryOptions = response.data.book_category
        } else {
          console.log('字典获取失败')
        }
      })
    },
    getBooksDetail() {
      this.listLoading = true
      api.getBooksDetail(this.bookTemplateId).then(response => {
        if (response.code === 10000) {
          for (const k in this.form) {
            this.form[k] = response.data[k]
          }
        } else {
          console.log('书籍信息获取失败')
        }
        this.listLoading = false
      })
    },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style scoped>
.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 300px;
  height: 305px;
}
.avatar-uploader:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 300px;
  line-height: 300px;
  text-align: center;
}
.avatar {
  max-width: 300px;
  max-height: 300px;
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
</style>
