<template>
  <div class="order-detail-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="订单编号">
          <el-input v-model="formInline.orderNum" placeholder="请输入订单编号"/>
        </el-form-item>
        <SearchSchool :school-id.sync="formInline.schoolId"/>
        <GradeClass :school-id="formInline.schoolId" :grade-id.sync="formInline.gradeId" :class-id.sync="formInline.classId"/>
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.studentName" placeholder="请输入学生姓名"/>
        </el-form-item>
        <el-form-item label="购买套餐">
          <el-select v-model="formInline.packageType" placeholder="请选择">
            <el-option value="">请选择</el-option>
            <el-option
              v-for="item in packageTypeOptions"
              :key="item.packageType"
              :label="item.packageTypeName"
              :value="item.packageType" />
          </el-select>
        </el-form-item>
        <el-form-item label="充值方式">
          <el-select v-model="formInline.orderType" placeholder="请选择">
            <el-option
              v-for="item in orderTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单支付时间">
          <el-date-picker
            v-model="date"
            :picker-options="pickerOptions"
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
      <el-button type="success" size="small" class="el-icon-download" @click="down()">导出订单详情</el-button>
    </div>
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="list"
        :cell-style="cellStyle"
        :header-cell-style="headerStyle"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row>
        <el-table-column align="center" label="序号" width="80">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column :render-header="renderOrderNo" label="订单编号" prop="orderNum" align="center"/>
        <el-table-column label="学校名称" align="center" prop="schoolName"/>
        <el-table-column label="年级" align="center" prop="gradeName"/>
        <el-table-column label="班级" align="center" prop="className"/>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column label="充值方式" align="center" prop="orderTypeStr"/>
        <el-table-column label="购买套餐" align="center" prop="packageTypeStr"/>
        <el-table-column label="支付手机号" align="center" prop="parentPhone"/>
        <el-table-column label="订单金额（元）" align="center">
          <template slot-scope="scope">
            <span style="color: #FF8F22;">{{ scope.row.totalFee | toRMB }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单金额明细（元）" align="center">
          <el-table-column label="书本押金" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.cashPledge | toRMB }}</span>
            </template>
          </el-table-column>
          <el-table-column label="亲禾支付微信手付费" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.companyCommissionCharge | toRMB }}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="renderTips" label="亲禾分成" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.companyIncome | toRMB }}</span>
            </template>
          </el-table-column>
          <el-table-column label="代理支付微信手续费" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.agentCommissionCharge | toRMB }}</span>
            </template>
          </el-table-column>
          <el-table-column :render-header="renderTips" label="代理收益" align="center">
            <template slot-scope="scope">
              <span style="color: #2DAE00;">{{ scope.row.agentIncome | toRMB }}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="订单支付时间" align="center" prop="timeEnd"/>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <div class="tips">
      <p>注：1、订单详情页合并了家长充值和后台充值的所有学生订单详情</p>
      <p style="text-indent: 1.5rem;">2、充值方式：家长充值（家长通过小程序充值）、后台充值（代理商通过后台充值）</p>
      <p style="text-indent: 1.5rem;">3、家长通过小程序充值的订单支付给微信平台0.6%的手续费</p>
      <p style="text-indent: 1.5rem;">因此代理商需支付代理分成那部分的手续费，剩余的手续费亲禾承担</p>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import GradeClass from '@/components/GradeClass'
import SearchSchool from '@/components/SearchSchool'
import { api } from '@/api/index'

export default {
  name: 'OrderDetail',
  components: {
    Pagination,
    GradeClass,
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
        gradeId: '',
        classId: '',
        orderType: '',
        studentName: '',
        packageType: '',
        startTime: '',
        endTime: '',
        pageNum: 1,
        pageSize: 10
      },
      orderTypeOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '1',
        label: '后台充值'
      }, {
        value: '2',
        label: '家长充值'
      }],
      packageTypeOptions: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      }
    }
  },
  created() {
    this.formInline.orderNum = this.$route.query.orderNum ? this.$route.query.orderNum : ''
    this.fetchData()
    this.getPackageType()
  },
  methods: {
    getPackageType() {
      api.getPackageType().then(res => {
        if (res.code === 10000) {
          this.packageTypeOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    computeDate() {
      if (this.date) {
        this.formInline.startTime = this.date[0]
        this.formInline.endTime = this.date[1]
      } else {
        this.formInline.startTime = ''
        this.formInline.endTime = ''
      }
    },
    // render 事件
    renderOrderNo(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '点击后台充值的订单编号，可查看本批次的后台充值订单',
              placement: 'top'
            }
          },
          [
            h('span', {
              class: {
                'el-icon-question': true
              }
            })
          ]
        )
      ]
    },
    renderTips(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '已扣除手续费',
              placement: 'top'
            }
          },
          [
            h('span', {
              class: {
                'el-icon-question': true
              }
            })
          ]
        )
      ]
    },
    fetchData() {
      this.listLoading = true
      api.getOrderQueryDetail(this.formInline).then(response => {
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
    headerStyle({ row, rowIndex }) {
      return 'padding: 0;'
    },
    down() {
      const param = '?orderNum=' + this.formInline.orderNum + '&schoolId=' + this.formInline.schoolId + '&gradeId=' + this.formInline.gradeId + '&classId=' + this.formInline.classId + '&orderType=' + this.formInline.orderType + '&studentName=' + this.formInline.studentName + '&packageType=' + this.formInline.packageType + '&startTime=' + this.formInline.startTime + '&endTime' + this.formInline.endTime
      api.exportOrderQueryDetail(param)
    }
  }
}
</script>

<style>
  .order-detail-container{
    margin: 20px;
  }
  .order-detail-container .el-date-editor{
    width: 260px;
  }
  .order-detail-container .el-range-separator{
    display: inline-block;
    width: 30px;
  }
  .order-detail-container .operation-container{
    margin-bottom: 20px;
  }
  .order-detail-container .el-table th>.cell{
    padding: 5px 0;
  }
  .order-detail-container .tips {
    color: #888;
    font-size: 12px;
    margin-top: 10px;
  }
  .order-detail-container .tips p{
    padding: 0;
    margin-top: 0;
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
