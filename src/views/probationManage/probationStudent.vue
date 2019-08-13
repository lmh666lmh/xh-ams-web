<template>
  <div class="probation-manage-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ schoolName }}/{{ schoolAccount }}</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="年级班级">
          <el-select v-model="formInline.gradeId" placeholder="请选择年级" style="width: 150px;" @change="getClass('search', formInline.gradeId)">
            <el-option value="">请选择年级</el-option>
            <el-option
              v-for="item in gradeOptions"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId" />
          </el-select>
          <el-select v-model="formInline.classId" placeholder="请选择班级" style="width: 150px;">
            <el-option value="">请选择班级</el-option>
            <el-option
              v-for="item in classOptions"
              :key="item.classId"
              :label="item.className"
              :value="item.classId" />
          </el-select>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.studentName" placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="试用状态">
          <el-select v-model="formInline.trialStatus" placeholder="请选择">
            <el-option
              v-for="item in trialStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否付费">
          <el-select v-model="formInline.payStatus" placeholder="请选择">
            <el-option
              v-for="item in payStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-download" @click="down()">导出试用名单</el-button>
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
        <el-table-column label="年级" align="center" prop="gradeName"/>
        <el-table-column label="班级" align="center" prop="className"/>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column :render-header="renderHeader" label="试用状态" align="center" prop="trialStatusStr"/>
        <el-table-column label="是否付费" align="center" prop="payStatusStr"/>
        <el-table-column label="试用天数" align="center" prop="trialDays"/>
        <el-table-column label="试用有效期" align="center" prop="trialValidityPeriod"/>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'ProbationStudent',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      schoolName: '',
      schoolAccount: '',
      formInline: {
        schoolId: '',
        trialStatus: '',
        payStatus: '',
        classId: '',
        gradeId: '',
        studentName: '',
        pageNum: 1,
        pageSize: 10
      },
      trialStatusOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '1',
        label: '试用中'
      }, {
        value: '2',
        label: '已试用'
      }],
      payStatusOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '未付费'
      }, {
        value: '1',
        label: '付费'
      }],
      gradeOptions: [],
      classOptions: []
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.formInline.payStatus = this.$route.query.payStatus ? this.$route.query.payStatus : ''
    this.fetchData()
    this.getGradeAll()
  },
  methods: {
    getGradeAll() {
      api.getAllGrade(this.formInline.schoolId).then(response => {
        if (response.code === 10000) {
          this.gradeOptions = response.data
        }
      })
    },
    getClass(type, gradeId) {
      this.classOptions = []
      if (type === 'search') {
        this.formInline.classId = ''
      }
      api.getAllClass({ gradeId: gradeId }).then(response => {
        if (response.code === 10000) {
          if (type === 'search') {
            this.classOptions = response.data
          }
        }
      })
    },
    fetchData() {
      this.listLoading = true
      api.getProbationNumList(this.formInline).then(response => {
        this.schoolName = response.data.schoolName
        this.schoolAccount = response.data.schoolAccount
        this.total = response.data.page.total
        this.list = response.data.page.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:5px 0'
    },
    down() {
      const param = '?schoolId=' + this.formInline.schoolId + '&trialStatus=' + this.formInline.trialStatus + '&payStatus=' + this.formInline.payStatus + '&classId' + this.formInline.classId + '&gradeId=' + this.formInline.gradeId + '&studentName=' + this.formInline.studentName
      api.exportProbationStudent(param)
    },
    routeTo(path) {
      this.$router.push({
        path: path
      })
    },
    back() {
      history.go(-1)
    },
    // render 事件
    renderHeader(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '当前页面只展示试用的学生',
              placement: 'top'
            }
          },
          [
            h('span', {
              class: {
                'el-icon-question': true
              }
            })
          ]
        )
      ]
    }
  }
}
</script>

<style scoped>
  .probation-manage-container{
    margin: 20px;
  }
  .probation-manage-container .info-container{
    margin-bottom: 20px;
  }
  .probation-manage-container .info-container>span{
    margin-right: 50px;
  }
  .probation-manage-container .info-container .info-title{
    color: #92c439;
  }
  .probation-manage-container .operation-container{
    margin-bottom: 20px;
  }
</style>
