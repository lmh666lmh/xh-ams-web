<template>
  <div class="personal-record-container">
    <div class="info-container">
      <span><span class="info-title">当前学生：</span>{{ student }}</span>
      <span><span class="info-title">所属学校：</span>{{ school }}</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <SearchBook :book-template-id.sync="formInline.bookTemplateId"/>
        <el-form-item label="借阅状态">
          <el-select v-model="formInline.bookStatus" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="借/还书时间">
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
        <el-table-column label="书柜编号" align="center" prop="bookcaseNum"/>
        <el-table-column label="借阅书籍" align="center" width="200">
          <template slot-scope="scope">
            <p v-for="item in scope.row.bookList" :key="item.bookRfId" class="bookDetail">《{{ item.bookName }}》</p>
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
            <span v-if="scope.row.returnBookcaseRow != 0">{{ scope.row.returnBookcaseRow }}{{ scope.row.returnBookcaseColumn >= 10 ? scope.row.returnBookcaseColumn : '0' + scope.row.returnBookcaseColumn }}</span>
            <span v-else-if="scope.row.returnBookcaseRow === 0 && scope.row.bookStatus === 1" >已归还管理员</span>
          </template>
        </el-table-column>
        <el-table-column label="借书时间" align="center" prop="createTime" width="180"/>
        <el-table-column label="还书时间" align="center" prop="returnTime" width="180"/>
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
import SearchBook from '@/components/SearchBook'
import { api } from '@/api/index'

export default {
  name: 'PersonalDetail',
  components: {
    Pagination,
    SearchBook
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      time: '',
      student: '',
      school: '',
      formInline: {
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
    this.formInline.studentId = this.$route.query.studentId
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
      api.getPersonalBorrowList(this.formInline).then(response => {
        this.total = response.data.page.total
        this.list = response.data.page.list
        this.student = response.data.studentName + '/' + response.data.gradeName + '-' + response.data.className
        this.school = response.data.schoolName + '/' + response.data.schoolAccount
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    routeTo(path) {
      this.$router.push({
        path: path,
        query: {
          schoolId: arguments[1]
        }
      })
    },
    back() {
      history.go(-1)
    }
  }
}
</script>

<style >
  .personal-record-container{
    margin: 20px;
  }
  .personal-record-container .operation-container{
    margin-bottom: 20px;
  }
  .personal-record-container .info-container{
    margin-bottom: 20px;
  }
  .personal-record-container .info-container>span{
    margin-right: 50px;
  }
  .personal-record-container .info-container .info-title{
    color: #92c439;
  }
  .personal-record-container .tips {
    color: #888;
    font-size: 12px;
  }
  .personal-record-container .tips p{
    padding: 0;
    margin-top: 0;
  }
  .el-date-editor {
    width: 260px !important;
  }
  .el-range-separator {
    display: inline-block !important;
    width: 20px !important;
    padding: 0 !important;
  }
  .personal-record-container .bookDetail {
    margin: 5px 0;
  }
</style>
