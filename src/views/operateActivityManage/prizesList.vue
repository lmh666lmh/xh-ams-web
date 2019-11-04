<template>
  <div class="prizes-list-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ schoolName }}/{{ schoolAccount }}</span>
      <el-button type="primary" size="mini" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.studentName" placeholder="请填写"/>
        </el-form-item>
        <el-form-item label="奖品名称">
          <el-select v-model="formInline.rewardType" placeholder="请选择">
            <el-option
              v-for="item in rewardTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="奖品状态">
          <el-select v-model="formInline.rewardStatus" placeholder="请选择">
            <el-option
              v-for="item in rewardStatusOptions"
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
        <el-table-column label="班级" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.gradeName }}-{{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column label="邀请的学生" align="center" prop="acceptStudentName"/>
        <el-table-column label="奖品名称" align="center" prop="rewardTypeStr"/>
        <el-table-column label="奖品状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.rewardStatus === 2 || scope.row.rewardStatus === 1" style="color: red;">待发放</span>
            <span v-else>{{ scope.row.rewardStatusStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" align="center" prop="address"/>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.rewardType === 7 && scope.row.rewardStatus === 3" type="text" size="small" @click="detailPrizesInfo(scope.row.shipWay, scope.row.trackNum)">发货信息</el-button>
            <el-button v-else-if="scope.row.rewardType === 7 && scope.row.rewardStatus !== 3" type="text" size="small" @click="editPrizesInfo(scope.row.invitedId)">填写发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :visible.sync="dialogFormVisible" :close-on-click-modal="false" title="发货信息" width="400px" @close="closeDialog">
      <el-form :model="form" :disabled="dialogFormDisabled">
        <el-form-item :label-width="formLabelWidth" label="发货方式" >
          <el-select v-model="form.shipWay" placeholder="请选择" size="mini">
            <el-option label="请选择" value=""/>
            <el-option label="快递发货" value="1"/>
            <el-option label="线下发货" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.shipWay === '1'" :label-width="formLabelWidth" label="快递单号" >
          <el-input v-model="form.trackNum" size="mini" style="width: 200px;"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="mini" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
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
        schoolId: '',
        studentName: '',
        rewardType: '',
        rewardStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      dialogFormVisible: false,
      formLabelWidth: '80px',
      dialogFormDisabled: false,
      form: {
        invitedId: '',
        shipWay: '',
        trackNum: ''
      },
      rewardTypeOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '1',
        label: '5天'
      }, {
        value: '2',
        label: '10天'
      }, {
        value: '3',
        label: '15天'
      }, {
        value: '4',
        label: '20天'
      }, {
        value: '5',
        label: '25天'
      }, {
        value: '6',
        label: '30天'
      }, {
        value: '7',
        label: '阅读器+30天'
      }, {
        value: '8',
        label: '90天'
      }],
      rewardStatusOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '3',
        label: '已发放'
      }, {
        value: '2',
        label: '待发放'
      }]
    }
  },
  created() {
    this.fetchData()
    this.formInline.schoolId = this.$route.query.schoolId
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
      api.getInviteGiftPrizesList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    back() {
      history.go(-1)
    },
    editPrizesInfo(invitedId) {
      this.dialogFormVisible = true
      this.dialogFormDisabled = false
      this.form.invitedId = invitedId
    },
    closeDialog() {
      this.dialogFormVisible = false
      this.form = {
        invitedId: '',
        shipWay: '',
        trackNum: ''
      }
    },
    detailPrizesInfo(shipWay, trackNum) {
      this.dialogFormDisabled = true
      this.form.shipWay = shipWay + ''
      if (shipWay === 1) {
        this.form.trackNum = trackNum
      }
      this.dialogFormVisible = true
    },
    submitForm() {
      if (this.dialogFormDisabled) {
        this.dialogFormVisible = false
        return
      }
      if (this.form.shipWay === '') {
        this.$message('请选择发货方式')
        return
      } else if (this.form.shipWay === '1' && this.form.trackNum === '') {
        this.$message('请填写快递单号')
        return
      }
      api.sentInviteGiftPrizes(this.form).then(res => {
        if (res.code === 10000) {
          this.dialogFormVisible = false
          this.form = {
            invitedId: '',
            shipWay: '',
            trackNum: ''
          }
          this.$message({
            message: '状态更新成功',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style>
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
  .prizes-list-container .search-container{
    margin-bottom: 20px;
  }
  .prizes-list-container .el-dialog__body{
    padding: 10px 20px;
  }
  .prizes-list-container .el-form-item{
    margin: 0;
  }
</style>
