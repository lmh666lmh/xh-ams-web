<template>
  <div class="pay-statistics-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>学校名字</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.bookName" placeholder=""/>
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
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="年级" align="center" prop="averageScoreStr"/>
        <el-table-column label="班级" align="center" prop="averageScoreStr"/>
        <el-table-column label="学生姓名" align="center" prop="borrowTotal"/>
        <el-table-column label="付费状态" align="center" prop="averageScoreStr"/>
        <el-table-column label="付费路径" align="center" prop="averageScoreStr"/>
        <el-table-column label="套餐类型" align="center" prop="averageScoreStr"/>
        <el-table-column label="会员有效期" align="center" prop="averageScoreStr"/>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'PayStatistics',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        schoolId: '',
        bookName: '',
        pageNum: 1,
        pageSize: 10
      },
      bookCategoryOptions: []
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getBooksList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
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
    back() {
      history.go(-1)
    }
  }
}
</script>

<style scoped>
  .pay-statistics-container{
    margin: 20px;
  }
  .pay-statistics-container .info-container{
    margin-bottom: 20px;
  }
  .pay-statistics-container .info-container>span{
    margin-right: 50px;
  }
  .pay-statistics-container .info-container .info-title{
    color: #92c439;
  }
</style>
