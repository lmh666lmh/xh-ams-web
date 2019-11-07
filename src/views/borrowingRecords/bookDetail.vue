<template>
  <div class="borrowing-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ school }}</span>
      <span><span class="info-title">当前查询书籍：</span>《 {{ bookName }} 》</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学生姓名">
          <el-autocomplete
            v-model="studentName"
            :fetch-suggestions="searchStudent"
            :debounce="700"
            :clearable="true"
            :trigger-on-focus="false"
            popper-class="my-autocomplete"
            placeholder="请填写"
            @select="searchStudentSelect">
            <i slot="suffix" class="el-icon-search el-input__icon"/>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">所在学校：{{ item.schoolName }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="借阅状态">
          <el-select v-model="formInline.bookStatus" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="借还时间">
          <el-date-picker
            v-model="time"
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="computeDate"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
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
        <el-table-column label="序号" width="95" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column label="年级-班级" align="center" prop="schoolNum">
          <template slot-scope="scope">
            <span>{{ scope.row.gradeName }} - {{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="借阅状态" align="center" prop="bookStatusStr"/>
        <el-table-column label="柜号-借" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.bookcaseRow }}{{ scope.row.bookcaseColumn >= 10 ? scope.row.bookcaseColumn : '0' + scope.row.bookcaseColumn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="柜号-还" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.returnBookcaseRow != 0">{{ scope.row.returnBookcaseRow }}{{ scope.row.returnBookcaseColumn >=10 ? scope.row.returnBookcaseColumn : '0' + scope.row.returnBookcaseColumn }}</span>
            <span v-else-if="scope.row.returnBookcaseRow === 0 && scope.row.bookStatus === 1" >已归还管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="借书时间" align="center" prop="createTime" width="180"/>
        <el-table-column label="还书时间" align="center" prop="returnTime" width="180"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/borrowingRecords/personalDetail?studentId=' + scope.row.studentId,)">个人借阅记录</el-button>
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
  name: 'BookDetail',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      school: null,
      bookName: null,
      studentName: '',
      time: '',
      formInline: {
        bookTemplateId: '',
        schoolId: '',
        studentId: '',
        bookStatus: '',
        createTime: '',
        returnTime: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '2',
        label: '在借'
      }, {
        value: '1',
        label: '已还'
      }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      }
    }
  },
  created() {
    this.formInline.bookTemplateId = this.$route.query.bookTemplateId
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
  },
  methods: {
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    cellDialogStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:10px 0'
    },
    fetchData() {
      this.listLoading = true
      api.getBookBorrowList(this.formInline).then(response => {
        this.total = response.data.page.total
        this.list = response.data.page.list
        this.school = response.data.schoolName + '/' + response.data.schoolAccount
        this.bookName = response.data.bookName
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    computeDate() {
      if (this.time) {
        this.formInline.createTime = this.time[0]
        this.formInline.returnTime = this.time[1]
      } else {
        this.formInline.createTime = ''
        this.formInline.returnTime = ''
      }
    },
    routeTo(path) {
      this.$router.push({
        path: path
      })
    },
    searchStudent(queryString, callback) {
      this.formInline.studentId = ''
      if (!queryString) {
        callback([])
      } else {
        api.getSearchStudent({
          searchKey: queryString
        }).then(res => {
          if (res.code === 10000) {
            const array = []
            res.data.forEach((value, index) => {
              array.push({
                value: value.studentName,
                studentId: value.studentId,
                schoolName: value.schoolName
              })
            })
            // 调用 callback 返回建议列表的数据
            callback(array)
          } else {
            callback([])
          }
        }).catch(err => {
          callback([])
          console.log(err)
        })
      }
    },
    searchStudentSelect(item) {
      this.formInline.studentId = item.studentId
    },
    back() {
      history.go(-1)
    }
  }
}
</script>

<style>
  .borrowing-container{
    margin: 20px;
  }
  .borrowing-container .info-container{
    margin-bottom: 20px;
  }
  .borrowing-container .info-container>span{
    margin-right: 50px;
  }
  .borrowing-container .info-container .info-title{
    color: #92c439;
  }
  .el-date-editor {
    width: 260px !important;
  }
  .el-range-separator {
    display: inline-block !important;
    width: 20px !important;
    padding: 0 !important;
  }
</style>
