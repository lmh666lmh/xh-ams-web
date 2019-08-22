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
        <el-form-item label="是否付费">
          <el-select v-model="formInline.payStatus" placeholder="请选择">
            <el-option
              v-for="item in payStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="有效期状态">
          <el-select v-model="formInline.expireTimeStatus" placeholder="请选择">
            <el-option
              v-for="item in expireTimeOptions"
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
        <el-table-column label="是否付费" align="center" prop="payStatusStr"/>
        <el-table-column label="有效期状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.expireTimeStatusStr === '到期'" style="color: red;">{{ scope.row.expireTimeStatusStr }}</span>
            <span>{{ scope.row.expireTimeStatusStr }}</span>
          </template>
        </el-table-column>
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
          <span style="margin-right: 50px;">代理商账号：{{ account }}</span>
          <span>预充款余额：<span class="orange">{{ agentCapital | toRMB }}</span></span>
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
                  <el-select v-model="form.packageType" size="mini" @change="computePrice">
                    <el-option value="">请选择</el-option>
                    <el-option
                      v-for="item in packageTypeOptions"
                      :key="item.packageType"
                      :label="item.packageTypeName"
                      :value="item.packageType" />
                  </el-select>
                </el-form-item>
                <el-form-item label="套餐单价:" class="space">
                  <span>{{ unitPrice | toRMB }}</span>
                </el-form-item>
                <el-form-item label="充值人数:" class="space">
                  <span>{{ totalSelectNum }} 个</span>
                </el-form-item>
                <el-form-item label="合计金额:" class="space">
                  <span class="orange">{{ (unitPrice * totalSelectNum) | toRMB }}</span>
                </el-form-item>
                <el-button type="primary" size="small" class="submitForm" @click="showPayPassword()">订单支付</el-button>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="payPasswordDialogVisible"
      :close-on-click-modal="false"
      title="请输入支付密码"
      width="300px"
      center>
      <el-input v-model="form.payPwd" size="mini" type="password" placeholder="请输入支付密码" maxlength="6"/>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="payPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitForm">支 付</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      unitPrice: 0,
      agentCapital: 0,
      formInline: {
        schoolId: '',
        gradeId: '',
        classId: '',
        studentName: '',
        payStatus: '',
        expireTimeStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      pickerOptions: {},
      form: {
        packageType: '',
        payPwd: ''
      },
      expireTimeOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '2',
        label: '未到期'
      }, {
        value: '1',
        label: '到期'
      }],
      payStatusOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '未付费'
      }, {
        value: '1',
        label: '已付费'
      }],
      multipleSelection: [],
      dialogFormVisible: false,
      dialogWidth: '800px',
      title: '批量充值',
      packageTypeOptions: [],
      payPasswordDialogVisible: false
    }
  },
  computed: {
    ...mapGetters([
      'setPayPwd',
      'account'
    ])
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
    this.getPayPackageType()
  },
  methods: {
    toRMB: value => {
      return `${(value / 100).toFixed(2)}` - 0
    },
    toCents: value => {
      return `${value * 100}`
    },
    getPayPackageType() {
      api.getPayPackageType({
        schoolId: this.formInline.schoolId,
        projectType: 1
      }).then(res => {
        if (res.code === 10000) {
          this.packageTypeOptions = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getAgentCapital() {
      api.getAgentCapital().then(res => {
        if (res.code === 10000) {
          this.agentCapital = res.data.readyChargeMoney
        }
      }).catch(err => {
        console.log(err)
      })
    },
    computePrice() {
      this.packageTypeOptions.find(item => {
        if (item.packageType === this.form.packageType) {
          this.unitPrice = item.price
        } else if (!this.form.packageType) {
          this.unitPrice = 0
        }
      })
    },
    fetchData() {
      this.listLoading = true
      api.getRechargeStudentList(this.formInline).then(response => {
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
      if (!this.setPayPwd) {
        this.$confirm('您暂未设置订单支付密码，请先设置支付密码', '提示', {
          confirmButtonText: '去设置',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.routeTo('/payPassword')
        }).catch(() => {
        })
        return
      }
      if (type === 'all' && this.multipleSelection.length === 0) {
        this.$message('请先选择需要充值的学生')
        return
      } else if (type === 'single') {
        this.toggleSelection(index)
      }
      this.getAgentCapital()
      this.dialogFormVisible = true
    },
    showPayPassword() {
      if (!this.unitPrice) {
        this.$message('请先选择需要充值的套餐')
        return
      } else if ((this.unitPrice * this.totalSelectNum) > this.agentCapital) {
        this.$message('您的预充款余额不足，请先联系亲禾客服进行充值')
        return
      }
      this.payPasswordDialogVisible = true
    },
    submitForm() {
      const arr = []
      this.multipleSelection.forEach((val, index) => {
        arr.push(val.studentId)
      })
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      api.addBatchRecharge({
        packageType: this.form.packageType,
        payPwd: this.form.payPwd.length > 6 ? this.form.payPwd : this.$getCode(this.form.payPwd),
        schoolId: this.formInline.schoolId,
        studentIds: arr
      }).then(res => {
        loading.close()
        if (res.code === 10000) {
          this.$message({
            message: '充值成功',
            type: 'success'
          })
          this.multipleSelection = []
          this.form.packageType = ''
          this.form.payPwd = ''
          this.payPasswordDialogVisible = false
          this.dialogFormVisible = false
          this.fetchData()
        } else {
          this.$message.error('充值失败')
          this.payPasswordDialogVisible = false
        }
      }).catch(err => {
        loading.close()
        console.log(err)
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
