<template>
  <div class="edit-container">
    <el-row :gutter="20" style="margin-top: 10px;">
      <el-col :span="5"><span class="title">书名：</span>《 {{ bookName }} 》</el-col>
    </el-row>
    <div style="margin-left: -10px;margin-top: 20px;">
      <el-button size="small" style="margin-left: 10px;" @click="cancel">返回</el-button>
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
        <el-table-column label="绑定学校名称" align="center" prop="schoolName"/>
        <el-table-column label="绑定学校账号" align="center" prop="schoolAccount"/>
        <el-table-column label="绑定书柜编码" align="center" prop="bookcaseNum"/>
        <el-table-column label="书本状态" align="center" prop="bookStatusStr"/>
        <el-table-column label="书本编码" align="center" prop="bookRfId"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button v-show="scope.row.schoolId != undefined" type="text" size="small" @click="routeTo('/school/detail?type=detail', scope.row.schoolId)" >学校详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'BooksNumber',
  data() {
    return {
      bookTemplateId: '',
      listLoading: true,
      list: null,
      bookName: ''
    }
  },
  created() {
    this.bookTemplateId = this.$route.query.bookTemplateId
    this.getBooksNumber(this.id)
  },
  methods: {
    getBooksNumber() {
      this.listLoading = true
      api.getBooksNumber(this.bookTemplateId).then(response => {
        this.bookName = response.data[0].bookName
        this.list = response.data
        this.listLoading = false
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    routeTo(path) {
      this.$router.push({
        path: path,
        query: {
          schoolId: arguments[1]
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped>
  .edit-container{
    padding: 10px;
    font-size: 13px;
  }
  .list{
    margin-top: 20px;
  }
  .title{
    font-size: 16px;
    color: #67C23A;
  }
</style>
