<template>
  <div class="bookcase-num-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ school }}</span>
      <span><span class="info-title">当前书柜编号：</span>{{ bookcase }}</span>
      <span><span class="info-title">当前查询柜号：</span>{{ bookcaseNum }}</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <SearchStudent :student-id.sync="formInline.studentId"/>
        <el-form-item label="借还操作时间">
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
        <el-table-column label="借阅书籍" align="center" width="200">
          <template slot-scope="scope">
            <p v-for="item in scope.row.bookList" :key="item.bookTemplateId">《{{ item.bookName }}》</p>
          </template>
        </el-table-column>
        <el-table-column label="操作类型" align="center" prop="brTypeStr"/>
        <el-table-column label="借/还书时间" align="center" prop="areaName" width="180">
          <template slot-scope="scope">
            <p v-if="scope.row.brType == 1">{{ scope.row.createTime }}</p>
            <p v-else-if="scope.row.brType == 2">{{ scope.row.returnTime }}</p>
            <div v-else>
              <p>借：{{ scope.row.createTime }}</p>
              <p>还：{{ scope.row.returnTime }}</p>
            </div>
          </template>
        </el-table-column>
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
import SearchStudent from '@/components/SearchStudent'
import { api } from '@/api/index'

export default {
  name: 'BookcaseNumDetail',
  components: {
    Pagination,
    SearchStudent
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      school: null,
      bookcase: null,
      bookcaseNum: null,
      time: '',
      formInline: {
        bookcaseId: '',
        schoolId: '',
        bookcaseRow: '',
        bookcaseColumn: '',
        studentId: '',
        bookStatus: '',
        createTime: '',
        returnTime: '',
        pageNum: 1,
        pageSize: 10
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      }
    }
  },
  created() {
    this.formInline.bookcaseId = this.$route.query.bookcaseId
    this.formInline.schoolId = this.$route.query.schoolId
    this.formInline.bookcaseRow = this.$route.query.row
    this.formInline.bookcaseColumn = this.$route.query.colum
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
      api.getBookcaseNumBorrowList(this.formInline).then(response => {
        this.total = response.data.page.total
        this.list = response.data.page.list
        this.school = response.data.schoolName + '/' + response.data.schoolAccount
        this.bookcase = response.data.bookcaseNum
        this.bookcaseNum = response.data.bookcaseRow.toString() + (response.data.bookcaseColumn >= 10 ? response.data.bookcaseColumn : '0' + response.data.bookcaseColumn)
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
    computeDate() {
      if (this.time) {
        this.formInline.createTime = this.time[0]
        this.formInline.returnTime = this.time[1]
      } else {
        this.formInline.createTime = ''
        this.formInline.returnTime = ''
      }
    },
    back() {
      history.go(-1)
    }
  }
}
</script>

<style>
  .bookcase-num-container{
    margin: 20px;
  }
  .bookcase-num-container .info-container{
    margin-bottom: 20px;
  }
  .bookcase-num-container .info-container>span{
    margin-right: 50px;
  }
  .bookcase-num-container .info-container .info-title{
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
  .bookcase-num-container .bookDetail{
    margin: 5px 0;
  }
  .bookcase-num-container p{
    margin: 0;
  }
</style>
