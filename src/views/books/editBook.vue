<template>
  <div class="edit-bookTemplate-container">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" label-width="80px" size="small" style="margin: 20px 0 0 20px;">
      <el-container style="width: 920px;">
        <el-aside width="300px">
          <div class="image-box">
            <el-form-item prop="bookPic">
              <el-input v-model="form.bookPic" style="display: none;"/>
              <el-upload
                :show-file-list="false"
                :http-request="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :action="domain"
                list-type="picture"
                accept=".jpeg,.png"
                class="avatar-uploader">
                <img v-if="form.bookPic" :src="form.bookPic" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon">上传书本封面</i>
              </el-upload>
            </el-form-item>
            <div v-show="isShowImageProgress" class="upload-mask">
              <el-progress :text-inside="true" :stroke-width="18" :percentage="imageProgress" class="progress-icon"/>
            </div>
          </div>
        </el-aside>
        <el-main>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="书籍名称" prop="bookName">
                <el-input v-model="form.bookName" maxlength="255"/>
              </el-form-item>
              <el-form-item label="作者" prop="bookAuthor">
                <el-input v-model="form.bookAuthor" maxlength="64"/>
              </el-form-item>
              <el-form-item label="ISBN" prop="isbn">
                <el-input v-model="form.isbn" maxlength="255"/>
              </el-form-item>
              <el-form-item label="定价" prop="bookPrice">
                <el-input v-model="form.bookPrice" maxlength="11">
                  <template slot="prepend">￥</template>
                </el-input>
              </el-form-item>
              <el-form-item label="售价" prop="bookSellingPrice">
                <el-input v-model="form.bookSellingPrice" maxlength="11">
                  <template slot="prepend">￥</template>
                </el-input>
              </el-form-item>
              <el-form-item label="出版社">
                <el-input v-model="form.press" maxlength="32"/>
              </el-form-item>
              <el-form-item label="出版时间">
                <el-date-picker
                  v-model="form.pressDate"
                  :picker-options="pickerOptions"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="出版时间"
                  style="width: 200px;"/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="适合年级" prop="fitGradeList">
                <el-select v-model="form.fitGradeList" multiple placeholder="请选择" style="width: 200px;" @change="matchingGrade">
                  <el-option
                    v-for="item in gradeTypeOptions"
                    :key="item.subCode"
                    :label="item.subName"
                    :value="item.subCode" />
                </el-select>
              </el-form-item>
              <el-form-item label="所属类目" prop="bookCategoryCode">
                <el-select v-model="form.bookCategoryCode" placeholder="请选择" style="width: 200px;">
                  <el-option value="">请选择</el-option>
                  <el-option
                    v-for="item in bookCategoryOptions"
                    :key="item.subCode"
                    :label="item.subName"
                    :value="item.subCode" />
                </el-select>
              </el-form-item>
              <el-form-item label="书本标签" prop="bookTagList">
                <el-select v-model="form.bookTagList" multiple placeholder="请选择" style="width: 200px;" @change="matchingTag">
                  <el-option
                    v-for="item in bookTagOptions"
                    :key="item.subCode"
                    :label="item.subName"
                    :value="item.subCode" />
                </el-select>
              </el-form-item>
              <el-form-item label="获奖情况">
                <el-input v-model="form.prizeDesc" maxlength="255"/>
              </el-form-item>
              <el-form-item label="初始评分">
                <el-input-number v-model="form.averageScore" :precision="1" :step="0.1" :min="0" :max="10"/>
              </el-form-item>
              <el-form-item label="绘本音频">
                <el-upload
                  :http-request="handleAudioSuccess"
                  :before-upload="beforeAudioUpload"
                  :action="domain"
                  :on-preview="handlePreview"
                  :before-remove="beforeRemove"
                  :limit="1"
                  :on-exceed="handleExceed"
                  :file-list="audioList"
                  accept=".mp3"
                  class="upload-audio">
                  <el-button size="small" type="primary">上传音频</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传mp3格式，且不超过30Mb</div>
                </el-upload>
                <el-progress v-show="isShowAudioProgress" :percentage="audioProgress" class="audio-progress"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
      <el-form-item label="亲子导读">
        <el-input
          :rows="4"
          v-model="form.bookReadIntro"
          type="textarea"
          style="width: 800px;"
          placeholder="请输入导读内容"
          maxlength="500"/>
      </el-form-item>
      <el-form-item label="内容简介">
        <el-input
          :rows="6"
          v-model="form.bookDesc"
          type="textarea"
          style="width: 800px;"
          placeholder="请输入内容简介"
          maxlength="500"/>
      </el-form-item>
      <el-form-item label="亲子问答">
        <div v-show="questionDTOList.length != 4" class="question-btn">
          <el-button type="primary" size="mini" @click="addQuestionList(1)">新增单选题</el-button>
          <el-button type="primary" size="mini" @click="addQuestionList(2)">新增拓展题</el-button>
        </div>
        <div v-if="questionDTOList.length !== 0">
          <div v-for="(item, index) in questionDTOList" :key="index" class="question-list">
            <el-card v-if="item.questionType === 1" class="list-item">
              <div slot="header">
                <el-form-item label="题目" style="margin: 0;">
                  <el-input v-model="item.questionContent" placeholder="请填写" class="question-title question-input"/>
                  <i v-if="!disabled" class="el-icon-remove question-icon remove-question-icon" @click="removeQuestionList(index)"/>
                </el-form-item>
              </div>
              <el-form-item label="选项">
                <div v-for="(value, key) in item.answerDTOList" :key="key" style="position: relative;">
                  <el-input v-model="value.answerContent" placeholder="请填写" class="question-item question-input">
                    <template slot="prepend">{{ value.answerKey }}</template>
                  </el-input>
                  <div v-if="!disabled" class="question-icon">
                    <i v-show="item.answerDTOList.length !=1 " class="el-icon-remove remove-question-icon" @click="removeQuestionItem(index, key)"/>
                    <span v-show="item.answerDTOList.length != 4">
                      <i v-show="key == item.answerDTOList.length - 1" class="el-icon-circle-plus add-question-icon" @click="addQuestionItem(index, key)"/>
                    </span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="答案">
                <el-radio-group v-for="(val, i) in item.answerDTOList" :key="i" v-model="item.answerKey">
                  <el-radio :label="val.answerKey" class="radio">{{ val.answerKey }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-card>
            <el-card v-else-if="item.questionType === 2" class="list-item">
              <el-form-item label="题目" style="margin: 0;">
                <el-input v-model="item.questionContent" placeholder="请填写" class="question-title question-input"/>
                <i v-if="!disabled" class="el-icon-remove question-icon remove-question-icon" @click="removeQuestionList(index)"/>
              </el-form-item>
            </el-card>
          </div>
        </div>
        <div v-else style="color: #ccc;">暂无问题，请添加</div>
      </el-form-item>
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
import * as qiniu from 'qiniu-js'
import { api } from '@/api/index'

export default {
  name: 'EditBook',
  data() {
    const regMoney = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    const checkPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入定价'))
      } else if (!regMoney.test(value)) {
        callback(new Error('请输入正确的价格(最多两位小数)'))
      } else {
        callback()
      }
    }
    const checkSellingPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入售价'))
      } else if (!regMoney.test(value)) {
        callback(new Error('请输入正确的价格(最多两位小数)'))
      } else {
        callback()
      }
    }
    return {
      bookTemplateId: '',
      type: '',
      radio: 6,
      disabled: false,
      isShowImageProgress: false,
      isShowAudioProgress: false,
      imageProgress: 0,
      audioProgress: 0,
      domain: 'https://upload.qiniup.com',
      imageUrl: 'http://img.qn.xiaohebook.com',
      audioUrl: 'https://voice.qn.xiaohebook.com',
      audioList: [], // 音乐列表
      questionDTOList: [],
      form: {
        bookPic: '',
        bookName: '',
        bookAuthor: '',
        isbn: '',
        bookPrice: '',
        bookSellingPrice: '',
        press: '',
        pressDate: '',
        fitGradeList: [],
        bookCategoryCode: '',
        bookTagList: [],
        prizeDesc: '',
        averageScore: '',
        editorRecommend: '',
        bookDesc: '',
        bookReadIntro: ''
      },
      bookTemplateFeatures: {
        fitGradeList: [],
        bookTagList: []
      },
      gradeTypeOptions: [],
      bookCategoryOptions: [],
      bookTagOptions: [],
      rules: {
        bookPic: [
          { required: true, message: '请上传图片', trigger: 'change' }
        ],
        bookName: [
          { required: true, message: '请输入书籍名称', trigger: 'blur' }
        ],
        bookAuthor: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ],
        isbn: [
          { required: true, message: '请输入书号', trigger: 'blur' }
        ],
        bookPrice: [
          { required: true, validator: checkPrice, trigger: 'blur' }
        ],
        bookSellingPrice: [
          { required: true, validator: checkSellingPrice, trigger: 'blur' }
        ],
        fitGradeList: [
          { required: true, message: '请选择适合年级', trigger: 'change' }
        ],
        bookCategoryCode: [
          { required: true, message: '请选择所属类目', trigger: 'change' }
        ],
        bookTagList: [
          { required: true, message: '请选择书本标签', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      }
    }
  },
  created() {
    this.bookTemplateId = this.$route.query.bookTemplateId
    this.type = this.$route.query.type
    if (this.type === 'detail') {
      this.disabled = true
    }
    if (this.type !== 'add') {
      this.getBooksDetail()
    } else {
      this.disabled = false
    }
    this.getDictionary()
  },
  methods: {
    toRMB: value => {
      return `${(value / 100).toFixed(2)}`
    },
    toCents: value => {
      let m = 0
      const s1 = value.toString()
      const s2 = (100).toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {
        console.log(e)
      }
      try {
        m += s2.split('.')[1].length
      } catch (e) {
        console.log(e)
      }
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
      // return Number((value * 100).toFixed(0))
    },
    toSpotScore: value => {
      if (!value) return ''
      return `${(value / 10).toFixed(1)}`
    },
    toScore: value => {
      return `${value * 10}`
    },
    matchingGrade() {
      this.bookTemplateFeatures.fitGradeList = []
      if (this.form.fitGradeList.length) {
        this.form.fitGradeList.forEach((value, index) => {
          this.bookTemplateFeatures.fitGradeList.push({
            subName: this.gradeTypeOptions.find(item => item.subCode === value).subName,
            subCode: value
          })
        })
      }
    },
    matchingTag() {
      this.bookTemplateFeatures.bookTagList = []
      if (this.form.bookTagList) {
        this.form.bookTagList.forEach((value, index) => {
          this.bookTemplateFeatures.bookTagList.push({
            subName: this.bookTagOptions.find(item => item.subCode === value).subName,
            subCode: value
          })
        })
      }
    },
    getDictionary() {
      api.getDictionary('book_category,grade_type,book_tag').then(response => {
        if (response.code === 10000) {
          this.bookCategoryOptions = response.data.book_category
          this.gradeTypeOptions = response.data.grade_type
          this.bookTagOptions = response.data.book_tag
        } else {
          console.log('字典获取失败')
        }
      })
    },
    getBooksDetail() {
      api.getBooksDetail(this.bookTemplateId).then(response => {
        if (response.code === 10000) {
          for (const k in this.form) {
            if (k === 'bookPrice' || k === 'bookSellingPrice') {
              this.form[k] = this.toRMB(response.data[k])
            } else if (k === 'averageScore') {
              this.form[k] = this.toSpotScore(response.data[k])
            } else if (k === 'fitGradeList') {
              if (response.data.bookTemplateFeatures) {
                if (response.data.bookTemplateFeatures.fitGradeList.length !== 0) {
                  response.data.bookTemplateFeatures.fitGradeList.forEach((item, index) => {
                    this.form.fitGradeList.push(item.subCode)
                  })
                }
              }
            } else if (k === 'bookTagList') {
              if (response.data.bookTemplateFeatures) {
                if (response.data.bookTemplateFeatures.bookTagList.length !== 0) {
                  response.data.bookTemplateFeatures.bookTagList.forEach((item, index) => {
                    this.form.bookTagList.push(item.subCode)
                  })
                }
              }
            } else {
              this.form[k] = response.data[k]
            }
          }
          this.questionDTOList = response.data.questionDTOList ? response.data.questionDTOList : []
          if (response.data.bookTemplateFeatures) {
            this.bookTemplateFeatures = response.data.bookTemplateFeatures
          }
          if (response.data.bookVoiceUrl) {
            this.audioList.push({
              name: response.data.bookVoiceName,
              url: response.data.bookVoiceUrl
            })
          }
        } else {
          console.log('书籍信息获取失败')
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    matchBookCategoryName(code) {
      let name = ''
      this.bookCategoryOptions.forEach((key, index) => {
        if (key.subCode === code) {
          name = key.subName
          return false
        }
      })
      return name
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
          if (this.type === 'add') {
            api.addBookTemplate({
              ...this.form,
              ...this.bookTemplateFeatures,
              ...{
                bookPrice: this.toCents(this.form.bookPrice),
                bookSellingPrice: this.toCents(this.form.bookSellingPrice),
                averageScore: this.toScore(this.form.averageScore),
                bookCategoryName: this.matchBookCategoryName(this.form.bookCategoryCode),
                bookVoiceName: this.audioList.length > 0 ? this.audioList[0].name : '',
                bookVoiceUrl: this.audioList.length > 0 ? this.audioList[0].url : '',
                questionDTOList: this.questionDTOList
              }
            }).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.$message({
                  message: '新增模板成功',
                  type: 'success'
                })
                this.$router.go(-1)
              } else {
                this.$message.error('新增模板失败')
              }
            }).catch(() => {
              loading.close()
            })
          } else {
            api.editBookTemplate({
              ...this.form,
              ...this.bookTemplateFeatures,
              ...{
                bookTemplateId: this.bookTemplateId,
                bookPrice: this.toCents(this.form.bookPrice),
                bookSellingPrice: this.toCents(this.form.bookSellingPrice),
                averageScore: this.toScore(this.form.averageScore),
                bookCategoryName: this.matchBookCategoryName(this.form.bookCategoryCode),
                bookVoiceName: this.audioList.length > 0 ? this.audioList[0].name : '',
                bookVoiceUrl: this.audioList.length > 0 ? this.audioList[0].url : '',
                questionDTOList: this.questionDTOList
              }
            }).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.$message({
                  message: '修改模板成功',
                  type: 'success'
                })
                this.$router.go(-1)
              } else {
                this.$message.error('修改模板失败')
              }
            }).catch(() => {
              loading.close()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAvatarSuccess(req) {
      const that = this
      this.isShowImageProgress = true
      // let fileType = ''
      // if (req.file.type === 'image/png') {
      //   fileType = 'png'
      // } else {
      //   fileType = 'jpg'
      // }
      // 重命名要上传的文件
      // const keyName = this.$uuid.v1().replace(/-/g, '') + '.' + fileType
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
              that.form.bookPic = that.imageUrl + '/' + res.key + '?' + new Date().getTime()
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
      const isLt1M = file.size / 1024 / 1024 < 5
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 5MB!')
      }
      return isLt1M
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，请先移除后在上传`)
    },
    beforeRemove(file, fileList) {
      if (file && file.status === 'success') {
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    beforeAudioUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 50
      if (!isLt1M) {
        this.$message.error('上传音频大小不能超过 50MB!')
      }
      return isLt1M
    },
    handleAudioSuccess(req) {
      const that = this
      // 重命名要上传的文件
      const keyName = req.file.name
      that.isShowAudioProgress = true
      // 从后端获取上传凭证token
      api.getToken({
        type: 'voice',
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
            mimeType: ['audio/mp3'] || null
          }
          const observe = {
            next(res) {
              that.audioProgress = parseInt(res.total.percent)
            },
            error(err) {
              that.isShowAudioProgress = false
              console.log(err)
            },
            complete(res) {
              // 上传成功以后会返回key 和 hash  key就是文件名了！
              that.isShowAudioProgress = false
              that.audioList = [{
                name: keyName,
                url: that.audioUrl + '/' + res.key
              }]
            }
          }
          const observable = qiniu.upload(req.file, keyName, res.data.token, putExtra, config)
          observable.subscribe(observe)
        } else {
          that.isShowAudioProgress = false
          this.$message.error('授权失败，请稍后重试')
        }
      })
    },
    addQuestionList(type) {
      let choiceList = 0
      let extendedList = 0
      this.questionDTOList.forEach((item, index) => {
        if (item.questionType === 1) {
          choiceList++
        } else if (item.questionType === 2) {
          extendedList++
        }
      })
      // 1:单选 2：拓展题
      if (type === 1) {
        if (choiceList === 3) {
          this.$message.warning('单选题最多只能添加3个哦')
          return false
        }
        this.questionDTOList.push({
          questionContent: '',
          questionType: 1,
          answerKey: '',
          answerDTOList: [{
            answerKey: 'A',
            answerContent: ''
          }]
        })
      } else if (type === 2) {
        if (extendedList === 1) {
          this.$message.warning('拓展题最多只能添加一个哦')
          return false
        }
        this.questionDTOList.push({
          questionContent: '',
          questionType: 2
        })
      }
    },
    removeQuestionList(index) {
      this.$confirm('确定要删除此问答？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.questionDTOList.splice(index, 1)
      }).catch(() => {
      })
    },
    addQuestionItem(index, key) {
      this.questionDTOList[index].answerDTOList.push({
        answerKey: 'A',
        answerContent: ''
      })
      this.sortQuestion()
    },
    removeQuestionItem(index, key) {
      this.$confirm('确定要删除此答案？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.questionDTOList[index].answerDTOList.splice(key, 1)
        this.sortQuestion()
      }).catch(() => {
      })
    },
    sortQuestion() {
      this.questionDTOList.forEach((item, index) => {
        if (item.questionType === 1) {
          item.answerDTOList.forEach((key, i) => {
            switch (i) {
              case 0:
                key.answerKey = 'A'
                break
              case 1:
                key.answerKey = 'B'
                break
              case 2:
                key.answerKey = 'C'
                break
              case 3:
                key.answerKey = 'D'
                break
              default:
                key.answerKey = 'A'
                break
            }
          })
        }
      })
    }
  }
}
</script>

<style>
  .edit-bookTemplate-container .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 300px;
    height: 305px;
  }
  .edit-bookTemplate-container .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .edit-bookTemplate-container .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 300px;
    height: 300px;
    line-height: 300px;
    text-align: center;
  }
  .edit-bookTemplate-container .avatar {
    max-width: 300px;
    max-height: 300px;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .edit-bookTemplate-container .image-box{
    position: relative;
    height: 305px;
    margin-left: -80px;
  }
  .edit-bookTemplate-container .upload-mask{
    position: absolute;
    width: 300px;
    bottom: -10px;
    right: 0;
  }
  .edit-bookTemplate-container .progress-icon{
    position: absolute;
    width: 300px;
  }
  .edit-bookTemplate-container .el-upload__tip{
    color: #ccc;
  }
  .edit-bookTemplate-container .audio-progress{
    width: 100%;
    position: absolute;
    bottom: 24px;
    left: 0;
  }
  .edit-bookTemplate-container .question-btn{
    margin-bottom: 20px;
  }
  .edit-bookTemplate-container .question-list{
    position: relative;
    width: 600px;
    margin-bottom: 20px;
  }
  .edit-bookTemplate-container .question-input{
    width: 430px;
  }
  .edit-bookTemplate-container .question-icon{
    position: absolute;
    top: 5px;
    left: 445px;
    font-size: 24px;
    color: #67C139;
  }
  .edit-bookTemplate-container .question-item{
    margin-bottom: 5px;
  }
  .edit-bookTemplate-container .question-list .radio{
    margin-right: 10px;
  }
  .edit-bookTemplate-container .list-item .el-form-item__label{
    width: 50px !important;
  }
  .edit-bookTemplate-container .list-item .el-form-item__content{
    margin-left: 50px !important;
  }
  .edit-bookTemplate-container .list-item .el-form-item{
    margin: 0;
  }
</style>
