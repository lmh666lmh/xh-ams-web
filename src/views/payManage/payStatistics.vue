<template>
  <div class="pay-statistics-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ schoolName }}/{{ schoolAccount }}</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <GradeClass :school-id="formInline.schoolId" :grade-id.sync="formInline.gradeId" :class-id.sync="formInline.classId"/>
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.studentName" placeholder="请输入学生姓名"/>
        </el-form-item>
        <el-form-item label="付费状态">
          <el-select v-model="formInline.payStatus" placeholder="请选择">
            <el-option
              v-for="item in payStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="充值方式">
          <el-select v-model="formInline.lastOrderType" placeholder="请选择">
            <el-option
              v-for="item in payTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="套餐类型">
          <el-select v-model="formInline.lastPackageType" placeholder="请选择">
            <el-option value="">请选择</el-option>
            <el-option
              v-for="item in packageTypeOptions"
              :key="item.packageType"
              :label="item.packageTypeName"
              :value="item.packageType" />
          </el-select>
        </el-form-item>
        <el-form-item label="会员有效期">
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
        <el-table-column label="年级" align="center" prop="gradeName"/>
        <el-table-column label="班级" align="center" prop="className"/>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column label="付费状态" align="center" prop="payStatusStr"/>
        <el-table-column :render-header="renderOrderType" label="充值方式" align="center" prop="lastOrderTypeStr"/>
        <el-table-column :render-header="renderPackageType" label="套餐类型" align="center" prop="lastPackageTypeStr"/>
        <el-table-column label="会员有效期" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.expireTimeStatusStr === '到期'" style="color: red;">{{ scope.row.expireTime }}</span>
            <span v-else>{{ scope.row.expireTime }}</span>
          </template>
        </el-table-column>
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
  name: 'PayStatistics',
  components: {
    Pagination,
    GradeClass
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      date: '',
      schoolName: '',
      schoolAccount: '',
      formInline: {
        schoolId: '',
        gradeId: '',
        classId: '',
        studentName: '',
        payStatus: '',
        lastOrderType: '',
        lastPackageType: '',
        expireTimeStart: '',
        expireTimeEnd: '',
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
      }],
      payTypeOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '1',
        label: '后台充值'
      }, {
        value: '2',
        label: '家长充值'
      }],
      packageTypeOptions: []
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
    this.getPackageType()
  },
  methods: {
    // render 事件
    renderOrderType(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '记录最后一次充值方式',
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
    // render 事件
    renderPackageType(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '记录最后一次购买套餐',
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
        this.formInline.expireTimeStart = this.date[0]
        this.formInline.expireTimeEnd = this.date[1]
      } else {
        this.formInline.expireTimeStart = ''
        this.formInline.expireTimeEnd = ''
      }
    },
    fetchData() {
      this.listLoading = true
      api.getRechargeStudentList(this.formInline).then(response => {
        this.total = response.data.page.total
        this.list = response.data.page.list
        this.schoolName = response.data.schoolName
        this.schoolAccount = response.data.schoolAccount
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
    back() {
      history.go(-1)
    }
  }
}
</script>

<style>
  .pay-statistics-container{
    margin: 20px;
  }
  .pay-statistics-container .info-container{
    margin-bottom: 20px;
  }
  .pay-statistics-container .info-container>span{
    margin-right: 50px;
  }
  .pay-statistics-container .info-container .info-title{
    color: #92c439;
  }
  .pay-statistics-container .el-range-separator{
    display: inline-block;
    width: 20px;
  }
  .pay-statistics-container .el-date-editor{
    width: 260px;
  }
</style>
