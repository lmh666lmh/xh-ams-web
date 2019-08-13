<template>
  <div class="recharge-manage-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.schoolAccountOrName" placeholder="请填写"/>
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
        <el-table-column label="学校账号" align="center" prop="schoolAccount" width="120"/>
        <el-table-column label="学校编码" align="center" prop="schoolNum"/>
        <el-table-column label="园长姓名" align="center" prop="leaderName"/>
        <el-table-column label="联系方式" align="center" prop="leaderPhone" width="120"/>
        <el-table-column label="城市区域" align="center" prop="areaName"/>
        <el-table-column label="详细地址" align="center" prop="address"/>
        <el-table-column label="书柜数量" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/school/bookcaseDetail', scope.row.schoolId)" >{{ scope.row.bookcaseTotal }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/schoolManage', scope.row.schoolId)">学校管理</el-button>
            <el-button type="text" size="small" @click="rechargeSet(scope.row.schoolId)">充值设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :visible.sync="rechargeSetForm.rechargeDialogVisible" :width="rechargeSetForm.formWidth" :close-on-click-modal="false" custom-class="addStudentDialog" title="充值设置">
      <div style="height: 405px;overflow: auto;">
        <el-form ref="rechargeSetForm" :model="rechargeSetForm.form" size="small">
          <el-form-item :label-width="rechargeSetForm.formLabelWidth" label="学校信息">
            <el-card class="box-card">
              <p>当前学校：{{ rechargeSetForm.schoolName }}</p>
            </el-card>
          </el-form-item>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="自主付费" name="self">
              <div class="tableList">
                <el-table
                  v-loading="selfDataListLoading"
                  :data="selfDataList"
                  :cell-style="cellDialogStyle"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row>
                  <el-table-column prop="projectName" label="套餐" align="center"/>
                  <el-table-column label="基础价(￥)" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.projectPrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="折扣价(￥)" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.discountRatio">{{ scope.row.projectPrice * scope.row.discountRatio }}</span>
                      <span v-else>{{ scope.row.projectPrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="代理分成比例" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.agentDivideRatio }}%</span>
                    </template>
                  </el-table-column>
                  <el-table-column label="代理加价(￥)" align="center">
                    <template slot-scope="scope">
                      <el-input-number v-model="scope.row.agentAddPrice" :step="1" :precision="0" :min="0" :max="scope.row.agentAddMaxPrice" controls-position="right" size="mini" label="代理加价" @change="handleChange" />
                    </template>
                  </el-table-column>
                  <el-table-column label="家长实付(￥)" align="center">
                    <template slot-scope="scope">
                      <span v-if="scope.row.discountRatio && scope.row.agentAddPrice">{{ (scope.row.projectPrice * scope.row.discountRatio) + scope.row.agentAddPrice }}</span>
                      <span v-else-if="scope.row.discountRatio && !scope.row.agentAddPrice">{{ scope.row.projectPrice * scope.row.discountRatio }}</span>
                      <span v-else-if="!scope.row.discountRatio && scope.row.agentAddPrice">{{ scope.row.projectPrice + scope.row.agentAddPrice }}</span>
                      <span v-else>{{ scope.row.projectPrice }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :render-header="renderHeader" label="是否显示" width="150" align="center">
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
                <p>注：1、折扣价为小禾官方推出的不定期优惠活动价</p>
                <P style="text-indent: 1.5rem;">2、家长实付 = 折扣价 + 代理加价 （不包含押金）</P>
                <p style="text-indent: 1.5rem;">3、代理商收益 = 折扣价 * 分成比例 + 代理加价</p>
                <p style="text-indent: 1.5rem;">4、代理加价存在上下限，如需调整，请联系：<span style="color: blue;">18046218009</span></p>
                <p style="text-indent: 1.5rem;">5、【是否显示】表示在小程序会员中是否显示该会员套餐</p>
              </div>
            </el-tab-pane>
            <el-tab-pane label="全园付费" name="all">
              <div class="tableList">
                <el-table
                  v-loading="allDataListLoading"
                  :data="allDataList"
                  :cell-style="cellDialogStyle"
                  element-loading-text="Loading"
                  border
                  fit
                  highlight-current-row>
                  <el-table-column prop="projectName" label="套餐" align="center"/>
                  <el-table-column label="价格" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.projectPrice | toRMB }}</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm">确 定</el-button>
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
        pageNum: 1,
        pageSize: 10
      },
      activeName: 'self',
      rechargeSetForm: {
        rechargeDialogVisible: false,
        formWidth: '900px',
        formLabelWidth: '70px',
        schoolName: '',
        schoolId: ''
      },
      selfDataList: [],
      selfDataListLoading: false,
      allDataListLoading: false,
      allDataList: []
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
      api.getSchoolList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    prohibit(id, flag) {
      let warnText = ''
      if (flag === 1) {
        warnText = '是否要启用此学校？'
      } else {
        warnText = '是否要禁用此学校？'
      }
      this.$confirm(warnText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.prohibitSchool({
          schoolId: id,
          enableFlag: flag
        }).then(response => {
          this.list = response.items
          this.fetchData()
        })
      }).catch(() => {

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
    rechargeSet(schoolId) {
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
          this.selfDataList = response.data.autoPay
          this.allDataList = response.data.allPay
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
      const updateList = []
      this.selfDataList.forEach((item, index) => {
        updateList.push({
          projectId: item.projectId,
          projectPrice: this.toCents(item.projectPrice) - 0,
          agentAddPrice: this.toCents(item.agentAddPrice) - 0,
          display: item.display ? 1 : 0
        })
      })
      api.updateRechargeSet({ ...{ updateList: updateList }, ...{ schoolId: this.rechargeSetForm.schoolId }}).then(response => {
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
      console.log(tab, event)
    },
    // render 事件
    renderHeader(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '是否在小程序中显示',
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
    handleChange(value) {
      console.log(value)
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
    max-height: 245px;
    overflow: auto;
  }
  .recharge-manage-container .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 0;
  }
  .recharge-manage-container .el-input-number{
    width: 100px;
  }
</style>
