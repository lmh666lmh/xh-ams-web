<template>
  <div class="web-recharge-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="订单编号">
          <el-input v-model="formInline.orderNum" placeholder="请输入订单编号"/>
        </el-form-item>
        <SearchSchool :school-id.sync="formInline.schoolId"/>
        <el-form-item label="订单状态">
          <el-select v-model="formInline.orderStatus" placeholder="请选择">
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单支付时间">
          <el-date-picker
            v-model="date"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="computeDate"/>
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
        <el-table-column label="订单编号" align="center" prop="orderNum"/>
        <el-table-column label="学校名称" align="center" prop="schoolName"/>
        <el-table-column label="订单状态" align="center" prop="orderStatusStr"/>
        <el-table-column label="充值人数" align="center" prop="payPersonTotal"/>
        <el-table-column label="订单金额（元）" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.totalFee | toRMB }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单支付时间" align="center" prop="timeEnd"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="detail(scope.row.orderNum)" >订单详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import SearchSchool from '@/components/SearchSchool'
import { api } from '@/api/index'

export default {
  name: 'WebRecharge',
  components: {
    Pagination,
    SearchSchool
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      date: '',
      formInline: {
        orderNum: '',
        schoolId: '',
        startTime: '',
        endTime: '',
        orderStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      orderStatusOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '未支付'
      }, {
        value: '1',
        label: '支付成功'
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    computeDate() {
      if (this.date) {
        this.formInline.startTime = this.date[0]
        this.formInline.endTime = this.date[1]
      } else {
        this.formInline.startTime = ''
        this.formInline.endTime = ''
      }
    },
    fetchData() {
      this.listLoading = true
      api.getOrderQueryList(this.formInline).then(response => {
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
        path: '/payManage/orderQuery/detail?orderNum=' + id
      })
    },
    down() {
      const param = '?orderNum=' + this.formInline.orderNum + '&schoolId=' + this.formInline.schoolId + '&startTime=' + this.formInline.startTime + '&endTime' + this.formInline.endTime + '&orderStatus' + this.formInline.orderStatus
      api.exportOrderQueryWeb(param)
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
  .my-autocomplete li {
    line-height: normal;
    padding: 7px;
  }
  .my-autocomplete .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .my-autocomplete .addr {
    font-size: 12px;
    color: #b4b4b4;
    display: block;
    text-indent: 1rem;
  }
  .my-autocomplete .highlighted .addr {
    color: #ddd;
  }
</style>
