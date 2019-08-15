<template>
  <div class="student-recharge-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ schoolName }}/{{ schoolAccount }}</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <GradeClass :school-id="formInline.schoolId" :grade-id.sync="formInline.gradeId" :class-id.sync="formInline.classId"/>
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.studentName" placeholder="请选择"/>
        </el-form-item>
        <el-form-item label="会员状态">
          <el-select v-model="formInline.payStatus" placeholder="请选择">
            <el-option
              v-for="item in payStatusOptions"
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
    <div class="operation-container">
      <span style="font-size: 12px;color: #797979;margin-right: 20px;">共选择 <span style="color: #579df8;">{{ totalSelectNum }}</span> 条</span>
      <el-button type="success" size="small" @click="showDialog('all')">批量充值</el-button>
    </div>
    <div class="list">
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="list"
        :cell-style="cellStyle"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column
          align="center"
          type="selection"
          width="55"/>
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="年级" align="center" prop="gradeName"/>
        <el-table-column label="班级" align="center" prop="className"/>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column label="会员状态" align="center" prop="trialStatusStr"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDialog('single', [list[scope.$index]])" >充值</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :width="dialogWidth" :close-on-click-modal="false" @close="closeDialog()">
      <div class="dialog-main">
        <div class="dialog-info">
          <span style="margin-right: 50px;">代理商账号：188888888</span>
          <span>预充款余额：<span class="orange">5800.00</span> 元</span>
        </div>
        <el-row :gutter="10">
          <el-col :span="16">
            <el-table
              :data="multipleSelection"
              :cell-style="cellStyle"
              height="250"
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
            </el-table>
          </el-col>
          <el-col :span="8">
            <div class="config-cont">
              <el-form :model="form" label-width="80px">
                <el-form-item label="选择套餐:" class="space">
                  <el-select v-model="formInline.payStatus" size="mini">
                    <el-option
                      v-for="item in payStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item label="套餐单价:" class="space">
                  <span>50 元</span>
                </el-form-item>
                <el-form-item label="充值人数:" class="space">
                  <span>{{ totalSelectNum }} 个</span>
                </el-form-item>
                <el-form-item label="合计金额:" class="space">
                  <span class="orange">6000.00</span>元
                </el-form-item>
                <el-button type="primary" size="small" class="submitForm" @click="submitForm()">订单支付</el-button>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import GradeClass from '@/components/GradeClass'
import { api } from '@/api/index'

export default {
  name: 'StudentRecharge',
  components: {
    Pagination,
    GradeClass
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      schoolName: '',
      schoolAccount: '',
      totalSelectNum: 0,
      formInline: {
        schoolId: '',
        trialStatus: '',
        payStatus: '',
        classId: '',
        gradeId: '',
        studentName: '',
        pageNum: 1,
        pageSize: 10
      },
      pickerOptions: {},
      form: {
        probationDays: 0
      },
      payStatusOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '未到期'
      }, {
        value: '1',
        label: '到期'
      }, {
        value: '2',
        label: '未付费'
      }],
      multipleSelection: [],
      dialogFormVisible: false,
      dialogWidth: '800px',
      title: '批量充值'
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
  },
  methods: {
    getConfig() {
    },
    fetchData() {
      this.listLoading = true
      api.getProbationStudentList(this.formInline).then(response => {
        this.schoolName = response.data.schoolName
        this.schoolAccount = response.data.schoolAccount
        this.total = response.data.page.total
        this.list = response.data.page.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    toggleSelection(rows) {
      this.$refs.multipleTable.clearSelection()
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      }
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
      this.totalSelectNum = this.multipleSelection.length
    },
    showDialog(type, index) {
      if (type === 'all' && this.multipleSelection.length === 0) {
        this.$message('请先选择需要充值的学生')
        return
      } else if (type === 'single') {
        this.toggleSelection(index)
      }
      this.dialogFormVisible = true
    },
    submitForm() {
      const arr = []
      this.multipleSelection.forEach((val, index) => {
        arr.push(val.studentId)
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    closeDialog() {
    },
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:3px 0'
    },
    routeTo(path) {
      this.$router.push({
        path: path
      })
    },
    back() {
      history.go(-1)
    }
  }
}
</script>

<style scoped>
  .student-recharge-container{
    margin: 20px;
  }
  .student-recharge-container .info-container{
    margin-bottom: 20px;
  }
  .student-recharge-container .info-container>span{
    margin-right: 50px;
  }
  .student-recharge-container .info-container .info-title{
    color: #92c439;
  }
  .student-recharge-container .operation-container{
    margin-bottom: 20px;
  }
  .student-recharge-container .dialog-info{
    position: relative;
    top: -20px;
  }
  .student-recharge-container .orange{
    color: #f08f35;
  }
  .student-recharge-container .config-cont{
    background-color: #f6f6f6;
    height: 250px;
    border-radius: 5px;
    padding: 30px 10px 10px;
    box-sizing: border-box;
    position: relative;
  }
  .student-recharge-container .space{
    margin-bottom: 0;
  }
  .student-recharge-container .submitForm{
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
</style>
