<template>
  <div class="school-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="书名">
          <el-input v-model="formInline.name" placeholder=""/>
        </el-form-item>
        <el-form-item label="绑定书柜编号">
          <el-input v-model="formInline.name" placeholder=""/>
        </el-form-item>
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.name" placeholder=""/>
        </el-form-item>
        <el-form-item label="书籍状态">
          <el-select v-model="formInline.name" placeholder="" style="width: 100px;">
            <el-option label="在柜" value="1"/>
            <el-option label="借阅" value="2"/>
            <el-option label="购买" value="3"/>
            <el-option label="丢失" value="4"/>
            <el-option label="回收" value="5"/>
          </el-select>
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
        <el-table-column label="书名" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/books/addBooks', scope.row.author)" >{{ scope.row.pageviews }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="作者" align="center" prop="author"/>
        <el-table-column label="书籍状态" width="110" align="center" prop="author"/>
        <el-table-column label="书籍类目" width="110" align="center" prop="author"/>
        <el-table-column label="绑定书柜编号" width="110" align="center" prop="author"/>
        <el-table-column label="绑定学校名称" width="110" align="center" prop="author"/>
        <el-table-column label="绑定学校账号" width="110" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/school/detail?type=detail', scope.row.author)" >{{ scope.row.pageviews }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// import { api } from '@/api/index'

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
        name: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(params) {
      // this.listLoading = true
      // api.getSchoolList(params).then(response => {
      //   this.list = response.items
      //   this.listLoading = false
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    onSubmit() {
      console.log('submit!')
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    routeTo(path) {
      this.$router.push({
        path: path,
        query: {
          id: arguments[1]
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
</style>
