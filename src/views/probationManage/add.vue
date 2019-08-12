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
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-download">批量添加试用</el-button>
    </div>
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="list"
        :cell-style="cellStyle"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column
          align="center"
          type="selection"
          width="55"/>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="年级" align="center" prop="gradeName"/>
        <el-table-column label="班级" align="center" prop="className"/>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column :render-header="renderHeader" label="试用状态" align="center" prop="trialStatusStr"/>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/equipment/bookcaseDetail', scope.row.bookcaseId, 'bookcase')" >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'AddProbation',
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
      gradeOptions: [],
      classOptions: [],
      multipleSelection: []
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
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
      api.getProbationStudentList(this.formInline).then(response => {
        this.schoolName = response.data.schoolName
        this.schoolAccount = response.data.schoolAccount
        this.total = response.data.page.total
        this.list = response.data.page.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
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
              content: '试用过的学生无法再次添加试用当前页面只展示试用的学生',
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
