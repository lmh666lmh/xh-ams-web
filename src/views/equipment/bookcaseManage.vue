<template>
  <div class="school-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="书柜编号">
          <el-input v-model="formInline.bookcaseNum" placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="绑定状态">
          <el-select v-model="formInline.bookcaseStatus" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="绑定学校名称/账号">
          <el-input v-model="formInline.schoolAccountOrName" placeholder="请选择"/>
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
        <el-table-column label="书柜编号" align="center" prop="bookcaseNum"/>
        <el-table-column label="绑定学校名称" align="center" prop="schoolName"/>
        <el-table-column label="绑定学校账号" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/school/detail?type=detail', scope.row.schoolId, 'school')" >{{ scope.row.schoolAccount }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.bookcaseStatus == 0" type="text" size="small" @click="routeTo('/school', scope.row.bookcaseId, 'bookcase')" >{{ scope.row.bookcaseStatusStr }}</el-button>
            <span v-if="scope.row.bookcaseStatus == 1" style="font-size: 12px;">{{ scope.row.bookcaseStatusStr }}</span>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/equipment/bookcaseDetail', scope.row.bookcaseId, 'bookcase')" >详情</el-button>
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'BookcaseManage',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        bookcaseNum: '',
        schoolAccountOrName: '',
        bookcaseStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '未绑定'
      }, {
        value: '1',
        label: '已绑定'
      }]
    }
  },
  created() {
    this.formInline.bookcaseStatus = this.$route.query.bookcaseStatus ? this.$route.query.bookcaseStatus : ''
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getEquipmentBookcaseList(this.formInline).then(response => {
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
      if (arguments[2] === 'school') {
        this.$router.push({
          path: path,
          query: {
            schoolId: arguments[1]
          }
        })
      } else {
        this.$router.push({
          path: path,
          query: {
            bookcaseId: arguments[1]
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .school-container{
    margin: 20px;
  }
</style>
