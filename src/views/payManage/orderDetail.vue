<template>
  <div class="order-detail-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="订单编号">
          <el-input v-model="formInline.studentName" placeholder="请输入订单编号"/>
        </el-form-item>
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.studentName" placeholder="请输入学校名称/账号"/>
        </el-form-item>
        <GradeClass :school-id="formInline.schoolId" :grade-id.sync="formInline.gradeId" :class-id.sync="formInline.classId"/>
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.studentName" placeholder="请输入学生姓名"/>
        </el-form-item>
        <el-form-item label="购买套餐">
          <el-select v-model="formInline.payType" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="充值方式">
          <el-select v-model="formInline.payType" placeholder="请选择">
            <el-option
              v-for="item in payTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单支付时间">
          <el-date-picker
            v-model="formInline.date"
            :picker-options="pickerOptions"
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
        <el-table-column :render-header="renderOrderNo" label="订单编号" prop="studentName" align="center"/>
        <el-table-column label="学校名称" align="center" prop="studentName"/>
        <el-table-column label="年级" align="center" prop="averageScoreStr"/>
        <el-table-column label="班级" align="center" prop="averageScoreStr"/>
        <el-table-column label="学生姓名" align="center" prop="averageScoreStr"/>
        <el-table-column label="充值方式" align="center" prop="gradeName"/>
        <el-table-column label="购买套餐" align="center" prop="averageScoreStr"/>
        <el-table-column label="支付手机号" align="center" prop="averageScoreStr"/>
        <el-table-column label="订单金额（元）" align="center" prop="averageScoreStr"/>
        <el-table-column label="订单金额明细（元）" align="center">
          <el-table-column label="书本押金" align="center" prop="averageScoreStr"/>
          <el-table-column label="亲禾支付微信手付费" align="center" prop="averageScoreStr"/>
          <el-table-column label="亲禾分成" align="center" prop="averageScoreStr"/>
          <el-table-column label="代理支付微信手续费" align="center" prop="averageScoreStr"/>
          <el-table-column label="代理收益" align="center" prop="averageScoreStr"/>
        </el-table-column>
        <el-table-column label="订单支付时间" align="center" prop="averageScoreStr"/>
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
import { api } from '@/api/index'

export default {
  name: 'OrderDetail',
  components: {
    Pagination,
    GradeClass
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        schoolId: '',
        gradeId: '',
        classId: '',
        studentName: '',
        payStatus: '',
        date: '',
        payType: '',
        pageNum: 1,
        pageSize: 10
      },
      payTypeOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '批量充值'
      }, {
        value: '1',
        label: '小程序充值'
      }],
      typeOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: 'A'
      }, {
        value: '1',
        label: 'B'
      }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
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
    headerStyle({ row, rowIndex }) {
      return 'padding: 0;'
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
  }
  .order-detail-container .tips p{
    padding: 0;
    margin-top: 0;
  }
</style>
