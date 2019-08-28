<template>
  <div class="recharge-manage-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.schoolAccountOrName" placeholder="请填写"/>
        </el-form-item>
        <el-form-item label="是否开启家长充值">
          <el-select v-model="formInline.openParentPay" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
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
        <el-table-column label="序号" width="95" align="center">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="学校名称" align="center" prop="schoolName"/>
        <el-table-column label="学校账号" align="center" prop="schoolAccount"/>
        <el-table-column :render-header="renderParentSet" label="是否开启家长充值" align="center" prop="openParentPayStr"/>
        <el-table-column label="学生总数" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/payManage/payStatistics', scope.row.schoolId)" >{{ scope.row.studentTotal }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/payManage/studentRecharge', scope.row.schoolId)">学生充值</el-button>
            <el-button type="text" size="small" @click="rechargeSet(scope.row.schoolId)">充值配置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :visible.sync="rechargeSetForm.rechargeDialogVisible" :width="rechargeSetForm.formWidth" :close-on-click-modal="false" custom-class="addStudentDialog" title="充值配置">
      <div style="height: 405px;overflow: auto;">
        <el-form ref="rechargeSetForm" :model="rechargeSetForm.form" size="small">
          <p style="margin-top: 0;">当前学校：{{ rechargeSetForm.schoolName }}</p>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="家长充值" name="self">
              <div class="tableList">
                <el-table
                  v-loading="autoPayLoading"
                  :data="autoPayData"
                  :cell-style="cellDialogStyle"
                  :span-method="objectSpanMethod"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row>
                  <el-table-column prop="projectName" label="套餐名称" align="center" width="80"/>
                  <el-table-column label="最低价(￥)" align="center" width="100">
                    <template slot-scope="scope">
                      <span>{{ scope.row.discountPrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="代理商加价(￥)" align="center">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.agentAddPrice" :step="1" :precision="0" :min="0" :max="scope.row.agentAddMaxPrice" controls-position="right" size="mini" label="代理加价" @change="computeAutoAddPrice(scope.row.agentAddPrice, scope.row.projectId)"/>
                    </template>
                  </el-table-column>
                  <el-table-column :render-header="renderCashPledgeFee" label="书本押金(￥)" align="center">
                    <template slot-scope="scope">
                      <el-input-number v-model="cashPledgeFee" :step="1" :precision="0" :min="0" :max="100" controls-position="right" size="mini" label="书本押金" @change="computeCashPledgeFee"/>
                    </template>
                  </el-table-column>
                  <el-table-column label="家长销售价(￥)" align="center" width="100">
                    <template slot-scope="scope">
                      <span style="color: red;">{{ scope.row.discountPrice + scope.row.agentAddPrice + cashPledgeFee }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="月平均价(￥)" align="center" width="100">
                    <template slot-scope="scope">
                      <span>{{ ((scope.row.discountPrice + scope.row.agentAddPrice + cashPledgeFee) / scope.row.months).toFixed(2) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="亲禾分成(￥)" align="center" width="100">
                    <template slot-scope="scope">
                      <span>{{ scope.row.companyDividePrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="代理收益(￥)" align="center" width="100">
                    <template slot-scope="scope">
                      <span>{{ scope.row.discountPrice + scope.row.agentAddPrice - scope.row.companyDividePrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :render-header="renderHeader" label="是否开启" align="center">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.display"
                        active-color="#13ce66"
                        inactive-color="#DBDFE6"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="margin-top: 20px;color: #a5a6a8;font-size: 12px;">
                <p>注：1、家长充值是配置小程序上家长购买会员套餐的价格；</p>
                <P style="text-indent: 1.5rem;">2、销售价 = 最低价 + 代理加价 + 书本押金；</P>
                <p style="text-indent: 1.5rem;">3、代理商收益 = 家长销售价 - 书本押金 - 亲禾分成</p>
                <p style="text-indent: 1.5rem;">4、代理加价存在上下限，如需调整，请联系：<span style="color: blue;">18046218009</span></p>
                <p style="text-indent: 1.5rem;">5、【是否开启】表示在小程序中【我的】-【会员充值】界面是否开启会员套餐充值功能；</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="阅读机套餐" name="robot">
              <div class="tableList">
                <el-table
                  v-loading="readRobotPackageLoading"
                  :data="readRobotPackageData"
                  :cell-style="cellDialogStyle"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row>
                  <el-table-column prop="projectName" label="套餐名称" align="center"/>
                  <el-table-column label="阅读机器人市场价(￥)" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.projectPrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="阅读机器人最低价(￥)" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.discountPrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :render-header="renderPlus" label="代理商加价(￥)" align="center">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.agentAddPrice" :step="1" :precision="0" :min="0" :max="scope.row.agentAddMaxPrice" controls-position="right" size="mini" label="代理加价"/>
                    </template>
                  </el-table-column>
                  <el-table-column :render-header="renderMember" label="会员卡价格(￥)" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.combinedProjectPrice">{{ scope.row.combinedProjectPrice }}元/{{ scope.row.combinedProjectUnit }}</span>
                      <span v-else>无</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="家长销售价(￥)" align="center">
                    <template slot-scope="scope">
                      <span style="color: red;">{{ scope.row.discountPrice + scope.row.agentAddPrice + (scope.row.combinedProjectPrice ? scope.row.combinedProjectPrice : 0) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="立省价格(￥)" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.projectPrice - scope.row.discountPrice - scope.row.agentAddPrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :render-header="renderHeader" label="是否开启" width="150" align="center">
                    <template slot-scope="scope">
                      <el-switch
                        v-model="scope.row.display"
                        active-color="#13ce66"
                        inactive-color="#DBDFE6"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="margin-top: 20px;color: #a5a6a8;font-size: 12px;">
                <p>注：1、阅读机器人套餐是配置阅读机加会员卡组合成套餐销售，在小程序上充值购买；</p>
                <P style="text-indent: 1.5rem;">2、阅读机器人最低价为代理商跟亲禾平台的结算价；</P>
                <p style="text-indent: 1.5rem;">3、阅读机机器人的利润 = 代理商加价价格；</p>
                <p style="text-indent: 1.5rem;">4、【是否开启】表示在小程序中【我的】-【会员充值】界面是否开启会员套餐充值功能；</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="后台充值" name="all">
              <div class="tableList">
                <el-table
                  v-loading="allPayDataLoading"
                  :data="allPayData"
                  :cell-style="cellDialogStyle"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row>
                  <el-table-column prop="projectName" label="套餐名称" align="center"/>
                  <el-table-column label="亲禾分成(￥)" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.discountPrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :render-header="renderContract" label="合同销售价(￥)" align="center">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.payProjectFeatures.contractPrice" :step="1" :precision="0" :min="scope.row.payProjectFeatures.minContractPrice" controls-position="right" size="mini" label="合同销售价"/>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="margin-top: 20px;color: #a5a6a8;font-size: 12px;">
                <p>注：1、后台充值是代理商通过线下收费后，再通过代理商后台给学生充值；</p>
                <P style="text-indent: 1.5rem;">2、合同销售价目的是方便代理商统计线下收益情况，默认销售价为【家长充值】里面配置的销售价，代理商根据合同销售价修改价格，修改的价格下限不低于【家长充值】里面的最低价；</P>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'SchoolList',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        schoolAccountOrName: '',
        openParentPay: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '关闭'
      }, {
        value: '1',
        label: '开启'
      }],
      activeName: 'self',
      rechargeSetForm: {
        rechargeDialogVisible: false,
        formWidth: '1100px',
        formLabelWidth: '70px',
        schoolName: '',
        schoolId: ''
      },
      autoPayData: [],
      autoPayLoading: false,
      allPayData: [],
      allPayDataLoading: false,
      readRobotPackageData: [],
      readRobotPackageLoading: false,
      cashPledgeFee: 0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toRMB: value => {
      return `${(value / 100).toFixed(2)}` - 0
    },
    toCents: value => {
      return `${value * 100}`
    },
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    cellDialogStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:10px 0'
    },
    fetchData() {
      this.listLoading = true
      api.getRechargeManageList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    routeTo(path) {
      this.$router.push({
        path: path,
        query: {
          schoolId: arguments[1]
        }
      })
    },
    computeAutoAddPrice(value, id) {
      let autoPayTotal = 0
      this.autoPayData.find(item => {
        if (item.projectId === id) {
          autoPayTotal = item.discountPrice + item.agentAddPrice + this.cashPledgeFee
        }
      })
      this.readRobotPackageData.find(item => {
        if (item.payProjectFeatures.combinedProjectId === id) {
          item.combinedProjectPrice = autoPayTotal
        }
      })
    },
    computeCashPledgeFee() {
      this.autoPayData.find(autoPayItem => {
        this.readRobotPackageData.find(item => {
          if (item.payProjectFeatures.combinedProjectId === autoPayItem.projectId) {
            item.combinedProjectPrice = autoPayItem.discountPrice + autoPayItem.agentAddPrice + this.cashPledgeFee
          }
        })
      })
    },
    rechargeSet(schoolId) {
      this.activeName = 'self'
      this.rechargeSetForm.rechargeDialogVisible = true
      this.rechargeSetForm.schoolId = schoolId
      api.getDetailRecharge({
        schoolId: schoolId
      }).then(response => {
        if (response.code === 10000) {
          this.rechargeSetForm.schoolName = response.data.schoolName
          response.data.autoPay.forEach((item, index) => {
            for (const key in item) {
              if (key.match('Price') || key === 'discountRatio') {
                item[key] = this.toRMB(item[key])
              }
              if (key.match('display')) {
                item[key] = !!item[key]
              }
            }
          })
          response.data.allPay.forEach((item, index) => {
            for (const key in item) {
              if (key.match('Price') || key === 'discountRatio') {
                item[key] = this.toRMB(item[key])
              }
              if (key === 'payProjectFeatures') {
                item.payProjectFeatures.minContractPrice = this.toRMB(item.payProjectFeatures.minContractPrice)
                item.payProjectFeatures.contractPrice = this.toRMB(item.payProjectFeatures.contractPrice)
              }
            }
          })
          response.data.readRobotPackage.forEach((item, index) => {
            for (const key in item) {
              if (key.match('Price') || key === 'discountRatio') {
                item[key] = this.toRMB(item[key])
              }
              if (key.match('display')) {
                item[key] = !!item[key]
              }
            }
          })
          this.autoPayData = response.data.autoPay
          this.allPayData = response.data.allPay
          this.readRobotPackageData = response.data.readRobotPackage
          this.cashPledgeFee = this.toRMB(response.data.cashPledgeFee)
        }
      }).catch(() => {

      })
    },
    confirm() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const autoPayList = []
      const allPayList = []
      const readRobotPackageList = []
      this.autoPayData.forEach((item, index) => {
        autoPayList.push({
          projectId: item.projectId,
          agentAddPrice: this.toCents(item.agentAddPrice) - 0,
          display: item.display ? 1 : 0
        })
      })
      this.allPayData.forEach((item, index) => {
        allPayList.push({
          projectId: item.projectId,
          contractPrice: this.toCents(item.payProjectFeatures.contractPrice) - 0,
          display: item.display ? 1 : 0
        })
      })
      this.readRobotPackageData.forEach((item, index) => {
        readRobotPackageList.push({
          projectId: item.projectId,
          agentAddPrice: this.toCents(item.agentAddPrice) - 0,
          display: item.display ? 1 : 0
        })
      })
      api.updateRechargeSet({
        ...{ autoPay: autoPayList },
        ...{ allPay: allPayList },
        ...{ readRobotPackage: readRobotPackageList },
        ...{ schoolId: this.rechargeSetForm.schoolId, cashPledgeFee: this.toCents(this.cashPledgeFee) - 0 }
      }).then(response => {
        loading.close()
        if (response.code === 10000) {
          this.rechargeSetForm.rechargeDialogVisible = false
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.fetchData()
        } else {
          this.$message.error('设置失败')
        }
      }).catch(() => {
        loading.close()
      })
    },
    cancel() {
      this.rechargeSetForm.rechargeDialogVisible = false
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 这里rowspan为1是行有一行合并,colspan为3是列有3列合并,你要合并几行几列就写上相应的数字
      if (columnIndex === 3) {
        if (rowIndex % this.autoPayData.length === 0) {
          return {
            rowspan: this.autoPayData.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // render 事件
    renderCashPledgeFee(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '押金设置0元时，即关闭收取押金；押金设置上限100元',
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
    renderParentSet(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '在操作栏【充值配置】里面设置',
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
    renderHeader(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '在小程序上是否开启套餐充值',
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
    renderPlus(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '加价上线499',
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
    renderMember(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '价格在【家长充值】里面配置',
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
    renderContract(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '为方便代理商统计线下收益，请根据合同销售价修改价格',
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
    }
  }
}
</script>

<style>
  .recharge-manage-container{
    margin: 20px;
  }
  .recharge-manage-container .box-card{
    width: 300px;
  }
  .recharge-manage-container .box-card p{
    height: 25px;
    line-height: 25px;
    margin: 0;
    font-size: 13px;
    color: #b58585;
  }
  .recharge-manage-container .box-card .el-card__body{
    padding: 5px;
  }
  .recharge-manage-container .tableList{
  }
  .recharge-manage-container .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 0;
  }
  .recharge-manage-container .el-input-number{
    width: 100px;
  }
</style>
