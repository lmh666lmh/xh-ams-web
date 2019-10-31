<template>
  <div class="invite-gift-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.schoolAccountOrName" placeholder="请填写"/>
        </el-form-item>
        <el-form-item label="活动状态">
          <el-select v-model="formInline.packageType" placeholder="请选择">
            <el-option
              v-for="item in orderTypeOptions"
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
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="学校名称" align="center" prop="schoolName"/>
        <el-table-column label="分享人数" align="center" prop="schoolAccount" width="120"/>
        <el-table-column label="奖品总数" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/operateActivity/prizesList', scope.row.schoolName, scope.row.schoolAccount)" >{{ scope.row.bookcaseTotal }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="待发奖品" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/operateActivity/prizesList', scope.row.schoolName, scope.row.schoolAccount)" >{{ scope.row.bookcaseTotal }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="活动状态" align="center" prop="createTime"/>
        <el-table-column label="是否开启活动" width="200" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.fixedTimeStatus"
              active-color="#13ce66"
              inactive-color="#DBDFE6"/>
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
  name: 'InviteGift',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        schoolAccountOrName: '',
        pageNum: 1,
        pageSize: 10
      },
      orderTypeOptions: [{
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
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding: 5px 0'
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
    },
    routeTo(path) {
      this.$router.push({
        path: path,
        query: {
          schoolName: arguments[1],
          schoolAccount: arguments[2]
        }
      })
    }
  }
}
</script>

<style scoped>
  .invite-gift-container{
    margin: 20px;
  }
</style>
