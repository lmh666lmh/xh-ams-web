<template>
  <div class="web-recharge-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="订单编号">
          <el-input v-model="formInline.studentName" placeholder="请输入订单编号"/>
        </el-form-item>
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.studentName" placeholder="请输入学校名称/账号"/>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="formInline.payStatus" placeholder="请选择">
            <el-option
              v-for="item in payStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单支付时间">
          <el-date-picker
            v-model="formInline.date"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-download" @click="down()">导出订单</el-button>
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
        <el-table-column label="订单编号" align="center" prop="gradeName"/>
        <el-table-column label="学校名称" align="center" prop="className"/>
        <el-table-column label="订单状态" align="center" prop="studentName"/>
        <el-table-column label="充值人数" align="center" prop="averageScoreStr"/>
        <el-table-column label="订单金额（元）" align="center" prop="averageScoreStr"/>
        <el-table-column label="订单支付时间" align="center" prop="averageScoreStr"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detail('123456')" >订单详情</el-button>
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
  name: 'WebRecharge',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        studentName: '',
        payStatus: '',
        date: '',
        payType: '',
        pageNum: 1,
        pageSize: 10
      },
      payStatusOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '未付费'
      }, {
        value: '1',
        label: '付费'
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
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
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:5px 0'
    },
    detail(id) {
      this.$router.push({
        path: '/payManage/orderQuery?id=' + id
      })
    },
    down() {
      api.exportProbationStudent()
    }
  }
}
</script>

<style>
  .web-recharge-container{
    margin: 20px;
  }
  .web-recharge-container .el-date-editor{
    width: 260px;
  }
  .web-recharge-container .el-range-separator{
    display: inline-block;
    width: 30px;
  }
  .web-recharge-container .operation-container{
    margin-bottom: 20px;
  }
</style>
