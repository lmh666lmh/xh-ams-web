<template>
  <div class="borrowing-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学校名称/账户">
          <el-autocomplete
            v-model="schoolName"
            :fetch-suggestions="searchSchool"
            popper-class="my-autocomplete"
            placeholder="请填写"
            @select="searchSchoolSelect">
            <i slot="suffix" class="el-icon-search el-input__icon"/>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">账号：{{ item.schoolAccount }}</span>
              <span class="addr">编码：{{ item.schoolNum }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-autocomplete
            v-model="studentName"
            :fetch-suggestions="searchStudent"
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
        <el-form-item label="借阅书籍">
          <el-autocomplete
            v-model="bookName"
            :fetch-suggestions="searchBooks"
            popper-class="my-autocomplete"
            placeholder="请填写"
            @select="searchBooksSelect">
            <i slot="suffix" class="el-icon-search el-input__icon"/>
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
        <br>
        <el-form-item label="借还时间">
          <el-date-picker
            v-model="time"
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
    <div class="operation-container">
      <!--<el-button-group style="margin-right: 20px;">-->
      <!--<el-button v-if="active === 'unNormal'" type="primary" size="small" @click="switchList('unNormal')">异常</el-button>-->
      <!--<el-button v-else size="small" @click="switchList('unNormal')">异常</el-button>-->
      <!--<el-button v-if="active === 'all'" type="primary" size="small" @click="switchList('all')">全部</el-button>-->
      <!--<el-button v-else size="small" @click="switchList('all')">全部</el-button>-->
      <!--</el-button-group>-->
      <el-button type="success" size="small" class="el-icon-download" @click="down('/excelTemplate/导入学校模板.xlsx')">导出借阅记录</el-button>
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
        <el-table-column label="学校名称" align="center" prop="schoolName"/>
        <el-table-column label="学校账号" align="center" prop="schoolAccount" width="120"/>
        <el-table-column label="年级-班级" align="center" prop="schoolNum">
          <template slot-scope="scope">
            <span>{{ scope.row.gradeName }} - {{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="studentName" width="120"/>
        <el-table-column label="借阅书籍" align="center" width="200">
          <template slot-scope="scope">
            <p v-for="item in scope.row.bookList" :key="item.bookTemplateId" class="bookDetail" @click="routeTo('/borrowingRecords/bookDetail' + '?bookTemplateId=' + item.bookTemplateId + '&schoolId=' + scope.row.schoolId)">《{{ item.bookName }}》</p>
          </template>
        </el-table-column>
        <el-table-column label="借阅状态" align="center" prop="bookStatusStr"/>
        <el-table-column label="柜号-借" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/borrowingRecords/bookcaseNumDetail?row=' + scope.row.bookcaseRow + '&colum=' + scope.row.bookcaseColumn + '&bookcaseId=' + scope.row.bookcaseId + '&schoolId=' + scope.row.schoolId )" >{{ scope.row.bookcaseRow }}{{ scope.row.bookcaseColumn >= 10 ? scope.row.bookcaseColumn : '0' + scope.row.bookcaseColumn }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="柜号-还" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.returnBookcaseRow != 0" type="text" size="small" @click="routeTo('/borrowingRecords/bookcaseNumDetail?row=' + scope.row.returnBookcaseRow + '&colum=' + scope.row.returnBookcaseColumn + '&bookcaseId=' + scope.row.bookcaseId + '&schoolId=' + scope.row.schoolId )" >{{ scope.row.returnBookcaseRow }}{{ scope.row.returnBookcaseColumn >= 10 ? scope.row.returnBookcaseColumn : '0' + scope.row.returnBookcaseColumn }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="借书时间" align="center" prop="createTime" width="200"/>
        <el-table-column label="还书时间" align="center" prop="returnTime" width="200"/>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/borrowingRecords/personalDetail?studentId=' + scope.row.studentId,)">个人借阅记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <div class="tips">
      <p>注：1、点击【借阅书籍】下的书籍，可查看该书籍下的所有学生借阅记录；</p>
      <p style="text-indent: 1.5rem;">2、点击【柜号】下的书柜号，可查看该柜号下的所有学生借阅记录；</p>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'BorrowingRecords',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      schoolName: '',
      studentName: '',
      bookName: '',
      time: '',
      formInline: {
        schoolId: '',
        studentId: '',
        bookTemplateId: '',
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
        label: '再借'
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
    this.fetchData()
  },
  methods: {
    onSubmit() {
      console.log(this.schoolName)
      if (!this.schoolName) {
        this.formInline.schoolId = ''
      }
      if (!this.studentName) {
        this.formInline.studentId = ''
      }
      if (!this.bookName) {
        this.formInline.bookTemplateId = ''
      }
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
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
    fetchData() {
      this.listLoading = true
      api.getBorrowRecordList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    routeTo(path) {
      this.$router.push({
        path: path
      })
    },
    down(url) {
      api.download(url)
    },
    searchSchool(queryString, callback) {
      this.formInline.schoolId = ''
      if (!queryString) {
        callback([])
      } else {
        api.getSearchSchool({
          searchKey: queryString
        }).then(res => {
          if (res.code === 10000) {
            const array = []
            res.data.forEach((value, index) => {
              array.push({
                value: value.schoolName,
                schoolId: value.schoolId,
                schoolNum: value.schoolNum,
                schoolAccount: value.schoolAccount
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
    searchBooks(queryString, callback) {
      this.formInline.bookTemplateId = ''
      if (!queryString) {
        callback([])
      } else {
        api.getSearchBooks({
          searchKey: queryString
        }).then(res => {
          if (res.code === 10000) {
            const array = []
            res.data.forEach((value, index) => {
              array.push({
                value: value.bookName,
                bookTemplateId: value.bookTemplateId
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
    searchSchoolSelect(item) {
      console.log(item)
      this.formInline.schoolId = item.schoolId
    },
    searchStudentSelect(item) {
      console.log(item)
      this.formInline.studentId = item.studentId
    },
    searchBooksSelect(item) {
      console.log(item)
      this.formInline.bookTemplateId = item.bookTemplateId
    }
  }
}
</script>

<style>
  .borrowing-container{
    margin: 20px;
  }
  .borrowing-container .operation-container{
    margin-bottom: 20px;
  }
  .borrowing-container .tips {
    color: #ccc;
    font-size: 12px;
    margin-top: 10px;
  }
  .borrowing-container .tips p{
    padding: 0;
    margin-top: 0;
  }
  .el-date-editor {
    width: 260px !important;
  }
  .el-range-separator {
    padding: 0 !important;
  }
  .my-autocomplete li {
    line-height: normal;
    padding: 7px;
  }
  .my-autocomplete .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .my-autocomplete .addr {
    font-size: 12px;
    color: #b4b4b4;
    display: block;
    text-indent: 1rem;
  }
  .my-autocomplete .highlighted .addr {
    color: #ddd;
  }
  .borrowing-container .bookDetail {
    color: #409EFF;
    cursor: pointer;
    margin: 5px 0;
  }

</style>
