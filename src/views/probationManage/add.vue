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
      <span style="font-size: 12px;color: #797979;margin-right: 20px;">共选择 <span style="color: #579df8;">{{ totalSelectNum }}</span> 条</span>
      <el-button type="success" size="small" @click="showDialog('all')">批量添加试用</el-button>
    </div>
    <div class="list">
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDialog('single', [list[scope.$index]])" >添加试用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :width="dialogWidth" :close-on-click-modal="false" @close="closeDialog()">
      <div class="dialog-main">
        <el-row :gutter="10">
          <el-col :span="16">
            <el-table
              :data="multipleSelection"
              :cell-style="cellStyle"
              height="250"
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
            </el-table>
          </el-col>
          <el-col :span="8">
            <div class="config-cont">
              <el-form :model="form" label-width="80px">
                <el-form-item label="开始时间:" class="space">
                  <el-form-item>
                    <el-date-picker
                      :readonly="true"
                      v-model="form.startTime"
                      size="small"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      style="width: 150px !important;"/>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="结束时间:" class="space">
                  <el-form-item>
                    <el-date-picker
                      v-model="form.endTime"
                      :picker-options="pickerOptions"
                      :clearable="false"
                      size="small"
                      type="date"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                      style="width: 150px !important;"
                      @change="computeDays"/>
                  </el-form-item>
                </el-form-item>
                <div style="font-size: 12px;color: red;text-align: center;">试用时间选择区间：{{ form.trialMinDays }}-{{ form.trialMaxDays }}天</div>
                <el-form-item label="试用天数:" class="space">
                  <span>{{ form.probationDays }} 天</span>
                </el-form-item>
                <el-form-item label="试用人数:" class="space">
                  <span>{{ totalSelectNum }} 个</span>
                </el-form-item>
                <el-button type="primary" size="small" class="submitForm" @click="submitForm()">添加试用</el-button>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
      totalSelectNum: 0,
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
      pickerOptions: {},
      form: {
        startTime: '',
        endTime: '',
        probationDays: 0,
        trialMinDays: 0,
        trialMaxDays: 0
      },
      timeInterval: null,
      gradeOptions: [],
      classOptions: [],
      multipleSelection: [],
      dialogFormVisible: false,
      dialogWidth: '800px',
      title: '添加试用'
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
    this.getGradeAll()
    this.getConfig()
  },
  methods: {
    getConfig() {
      api.getProbationConfig().then(response => {
        if (response.code === 10000) {
          this.form.trialMinDays = response.data.trialMinDays
          this.form.trialMaxDays = response.data.trialMaxDays
          this.form.startTime = response.data.startTime
          this.form.endTime = response.data.endTime
          this.pickerOptions = {
            disabledDate(time) {
              const curDate = (new Date()).getTime()
              return time.getTime() < (curDate + (response.data.trialMinDays - 1) * 24 * 3600 * 1000) || time.getTime() > (curDate + response.data.trialMaxDays * 24 * 3600 * 1000) // 如果没有后面的-8.64e6就是不可以选择今天的
            }
          }
          this.computeDays()
        }
      })
    },
    computeDays() {
      this.form.probationDays = this.dateDiff(this.form.startTime, this.form.endTime)
    },
    dateDiff(sDate1, sDate2) {
      const date1 = sDate1.split('-')
      const oDate1 = new Date(date1[1] + '-' + date1[2] + '-' + date1[0]) // 转换为xx-xx-xxxx格式
      const date2 = sDate2.split('-')
      const oDate2 = new Date(date2[1] + '-' + date2[2] + '-' + date2[0])
      return parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
    },
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
      this.$refs.multipleTable.clearSelection()
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
      this.totalSelectNum = this.multipleSelection.length
    },
    showDialog(type, index) {
      if (type === 'all' && this.multipleSelection.length === 0) {
        this.$message('请先选择需要充值的学生')
        return
      } else if (type === 'single') {
        this.toggleSelection(index)
      }
      this.dialogFormVisible = true
    },
    submitForm() {
      if (!this.form.probationDays) {
        this.$message.error('请选择结束时间')
        return
      } else if (!this.totalSelectNum) {
        this.$message.error('请选择试用的学生')
        return
      }
      const arr = []
      this.multipleSelection.forEach((val, index) => {
        arr.push(val.studentId)
      })
      api.addProbationStudent({
        num: this.form.probationDays,
        studentIds: arr
      }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '添加试用成功',
            type: 'success'
          })
          this.dialogFormVisible = false
          this.fetchData()
        } else {
          this.$message.error('请选择试用的学生')
        }
      }).catch(err => {
        console.log(err)
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    closeDialog() {
    },
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:3px 0'
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
              content: '试用过的学生无法再次添加试用,当前页面只展示试用的学生',
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
  .probation-manage-container .config-cont{
    background-color: #f6f6f6;
    height: 250px;
    border-radius: 5px;
    padding: 30px 10px 10px;
    box-sizing: border-box;
    position: relative;
  }
  .probation-manage-container .space{
    margin-bottom: 0;
  }
  .probation-manage-container .submitForm{
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
