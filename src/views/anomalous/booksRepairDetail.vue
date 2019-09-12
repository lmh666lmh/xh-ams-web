<template>
  <div class="books-repair-detail-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ school }}</span>
      <span><span class="info-title">书柜编号：</span>{{ bookName }}</span>
      <span><span class="info-title">报修书籍：</span>《 {{ bookName }} 》</span>
      <el-button type="primary" size="mini" @click="back">返回</el-button>
    </div>
    <div class="operation-container">
      <span style="color: red;">报修处理选择：</span>
      <el-radio v-model="radio" label="1">暂不报修</el-radio>
      <el-radio v-model="radio" label="2">锁柜报修</el-radio>
      <el-button type="primary" size="mini" style="margin-left: 50px;" @click="back">提交处理</el-button>
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
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="schoolName"/>
        <el-table-column label="年级-班级" align="center" prop="schoolAccount"/>
        <el-table-column label="报修学生" align="center" prop="schoolAccount"/>
        <el-table-column label="书籍破损图片" align="center">
          <template slot-scope="scope">
            <span>《{{ scope.row.leaderName }}》</span>
          </template>
        </el-table-column>
        <el-table-column label="谁破坏的书籍" align="center" prop="leaderName"/>
        <el-table-column label="备注" align="center" prop="areaName"/>
        <el-table-column label="报修时间" align="center" prop="createTime"/>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'BooksRepairDetail',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      school: '',
      bookName: '',
      radio: '',
      formInline: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    back() {
      history.go(-1)
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:10px 0'
    },
    fetchData() {
      this.listLoading = true
      api.getSchoolList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
  .books-repair-detail-container{
    margin: 20px;
  }
  .books-repair-detail-container .info-container{
    margin-bottom: 20px;
  }
  .books-repair-detail-container .info-container>span{
    margin-right: 50px;
  }
  .books-repair-detail-container .info-container .info-title{
    color: #92c439;
  }
  .books-repair-detail-container .operation-container{
    padding: 20px;
    border:1px solid #ebeef5;
    border-bottom: 0;
  }
</style>
