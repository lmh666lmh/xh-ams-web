<template>
  <div class="probation-manage-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.searchKey" placeholder="请选择"/>
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
        <el-table-column label="学校名称" align="center" prop="schoolName"/>
        <el-table-column label="学校账号" align="center" prop="schoolAccount"/>
        <el-table-column label="学生总数" align="center" prop="studentNums"/>
        <el-table-column label="试用人数" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.trailStudentNums != 0" type="text" size="small" @click="routeTo('/probation/probationStudent?schoolId=' + scope.row.schoolId)" >{{ scope.row.trailStudentNums }}</el-button>
            <span v-else>{{ scope.row.trailStudentNums }}</span>
          </template>
        </el-table-column>
        <el-table-column label="试用付费人数" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.transferPayStudentNums != 0" type="text" size="small" @click="routeTo('/probation/probationStudent?schoolId=' + scope.row.schoolId + '&payStatus=1')" >{{ scope.row.transferPayStudentNums }}</el-button>
            <span v-else>{{ scope.row.transferPayStudentNums }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/probation/add?schoolId=' + scope.row.schoolId)" >添加试用学生</el-button>
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
  name: 'ProbationManageIndex',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        searchKey: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getProbationList(this.formInline).then(response => {
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
      return 'padding:0'
    },
    routeTo(path) {
      this.$router.push({
        path: path
      })
    }
  }
}
</script>

<style scoped>
  .probation-manage-container{
    margin: 20px;
  }
</style>
