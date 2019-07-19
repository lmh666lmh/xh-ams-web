<template>
  <div class="school-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="书名">
          <el-input v-model="formInline.bookName" placeholder=""/>
        </el-form-item>
        <el-form-item label="年龄段">
          <el-select v-model="formInline.ageRange" placeholder="" style="width: 100px;">
            <el-option label="请选择" value=""/>
            <el-option
              v-for="item in ageRangeOptions"
              :key="item.subCode"
              :label="item.subName"
              :value="item.subCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属类目">
          <el-select v-model="formInline.bookCategoryCode" placeholder="" style="width: 100px;">
            <el-option label="请选择" value=""/>
            <el-option
              v-for="item in bookCategoryOptions"
              :key="item.subCode"
              :label="item.subName"
              :value="item.subCode" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--<div class="operation-container">
    <el-button type="success" size="small" class="el-icon-circle-plus" @click="routeTo('/books/addBooks')">新增书籍</el-button>
    <el-button type="success" size="small" class="el-icon-download">导入</el-button>
    <el-button type="success" size="small" class="el-icon-download">模版下载</el-button>
    </div>-->
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
        <el-table-column label="书名" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/books/addBooks?type=detail', scope.row.bookTemplateId)" >{{ scope.row.bookName }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="作者" align="center" prop="bookAuthor"/>
        <el-table-column label="书籍类目" align="center" prop="bookCategoryName"/>
        <el-table-column label="借阅次数" align="center" prop="borrowTotal"/>
        <el-table-column label="热门指数" align="center" prop="averageScoreStr"/>
        <el-table-column label="入库数量" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/books/booksNumber', scope.row.bookTemplateId)" >{{ scope.row.bookTotal }}</el-button>
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
  name: 'Books',
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
        ageRange: '',
        bookCategoryCode: '',
        pageNum: 1,
        pageSize: 10
      },
      ageRangeOptions: [],
      bookCategoryOptions: []
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
    this.getDictionary()
  },
  methods: {
    getDictionary() {
      api.getDictionary('book_category,age_range').then(response => {
        if (response.code === 10000) {
          this.ageRangeOptions = response.data.age_range
          this.bookCategoryOptions = response.data.book_category
        } else {
          console.log('字典获取失败')
        }
      })
    },
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
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    routeTo(path) {
      this.$router.push({
        path: path,
        query: {
          bookTemplateId: arguments[1]
        }
      })
    }
  }
}
</script>

<style scoped>
  .school-container{
    margin: 20px;
  }
  .operation-container{
    margin-bottom: 20px;
  }
</style>
