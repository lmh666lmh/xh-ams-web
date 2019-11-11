<template>
  <div class="bookcase-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="书柜编号">
          <el-input v-model="formInline.bookcaseNum" placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.schoolAccountOrName" placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="藏书量预警">
          <el-select v-model="formInline.collectionNum" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="定时开关机状态">
          <el-select v-model="formInline.switchOpen" placeholder="请选择">
            <el-option
              v-for="item in switchOpenOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
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
        <el-table-column label="书柜编号" align="center" prop="bookcaseNum"/>
        <el-table-column label="绑定学校名称" align="center" prop="schoolName"/>
        <el-table-column label="绑定学校账号" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/school/detail?type=detail', scope.row.schoolId, 'school')" >{{ scope.row.schoolAccount }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="书籍总量" align="center" prop="allNum"/>
        <el-table-column label="在借书籍" align="center" prop="borrowingNum"/>
        <el-table-column label="在柜书籍" align="center" prop="inCabinetNum"/>
        <el-table-column label="藏书量预警" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.collectionWarning === 0 || scope.row.collectionWarning === 2" style="color: red;">{{ scope.row.collectionWarningStr }}</span>
            <span v-else>{{ scope.row.collectionWarningStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="定时开关机状态" align="center" prop="switchOpenStr"/>
        <el-table-column label="设备状态" align="center">
          <template slot-scope="scope">
            <span v-if="!scope.row.isOnline" style="color: red;">{{ scope.row.isOnlineStr }}</span>
            <span v-else>{{ scope.row.isOnlineStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/equipment/bookcaseDetail?bookcaseId=' + scope.row.bookcaseId + '&schoolName=' + scope.row.schoolName + '&schoolAccount=' + scope.row.schoolAccount + '&bookcaseNum=' + scope.row.bookcaseNum + '&isOnline=' + scope.row.isOnline, 'bookcase')" >远程管理</el-button>
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
        collectionNum: '',
        switchOpen: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '112-172',
        label: '正常'
      }, {
        value: '0-110',
        label: '低藏书'
      }, {
        value: '172-192',
        label: '高藏书'
      }],
      switchOpenOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '1',
        label: '开启'
      }, {
        value: '0',
        label: '关闭'
      }]
    }
  },
  created() {
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
      this.formInline.pageNum = 1
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
          path: path
        })
      }
    }
  }
}
</script>

<style scoped>
  .bookcase-container{
    margin: 20px;
  }
</style>
