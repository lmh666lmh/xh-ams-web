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
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="充值方式" align="center" prop="gradeName"/>
        <el-table-column :render-header="renderOrderNo" label="订单编号" prop="studentName" align="center"/>
        <el-table-column label="学校名称" align="center" prop="studentName"/>
        <el-table-column label="年级" align="center" prop="averageScoreStr"/>
        <el-table-column label="班级" align="center" prop="averageScoreStr"/>
        <el-table-column label="学生姓名" align="center" prop="averageScoreStr"/>
        <el-table-column label="购买套餐" align="center" prop="averageScoreStr"/>
        <el-table-column label="订单金额明细（元）" align="center">
          <el-table-column label="押金（元）" align="center" prop="averageScoreStr"/>
          <el-table-column label="成本（元）" align="center" prop="averageScoreStr"/>
          <el-table-column label="利润（元）" align="center" prop="averageScoreStr"/>
          <el-table-column label="订单总金额（元）" align="center" prop="averageScoreStr"/>
        </el-table-column>
        <el-table-column label="订单支付时间" align="center" prop="averageScoreStr"/>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
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
    padding: 3px 0;
  }
</style>
