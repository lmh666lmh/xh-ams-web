<template>
  <div class="prizes-list-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ schoolName }}/{{ schoolAccount }}</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.schoolAccountOrName" placeholder="请填写"/>
        </el-form-item>
        <el-form-item label="奖品名称">
          <el-select v-model="formInline.packageType" placeholder="请选择">
            <el-option
              v-for="item in orderTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖品状态">
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
        <el-table-column label="班级" align="center" prop="schoolName"/>
        <el-table-column label="学生姓名" align="center" prop="schoolAccount" width="120"/>
        <el-table-column label="邀请的学生" align="center" prop="createTime"/>
        <el-table-column label="奖品名称" align="center" prop="createTime"/>
        <el-table-column label="奖品状态" align="center" prop="createTime"/>
        <el-table-column label="收货地址" align="center" prop="createTime"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/schoolManage', scope.row.schoolId)">填写发货</el-button>
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
  name: 'PrizesList',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      schoolName: null,
      schoolAccount: null,
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
    this.schoolName = this.$route.query.schoolName
    this.schoolAccount = this.$route.query.schoolAccount
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
    back() {
      history.go(-1)
    }
  }
}
</script>

<style scoped>
  .prizes-list-container{
    margin: 20px;
  }
  .prizes-list-container .info-container{
    margin-bottom: 20px;
  }
  .prizes-list-container .info-container>span{
    margin-right: 50px;
  }
  .prizes-list-container .info-container .info-title{
    color: #92c439;
  }
</style>
