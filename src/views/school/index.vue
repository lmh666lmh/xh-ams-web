<template>
  <div class="school-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.schoolAccountOrName" placeholder="请填写"/>
        </el-form-item>
        <el-form-item label="城市区域">
          <el-select v-model="formInline.provinceId" style="width: 150px;" @change="getCity(formInline.provinceId)">
            <el-option value="">请选择</el-option>
            <el-option
              v-for="item in provinceOptions"
              :key="item.provinceId"
              :label="item.provinceName"
              :value="item.provinceId" />
          </el-select>
          <el-select v-model="formInline.cityId" style="width: 150px;" @change="getCountry(formInline.cityId)">
            <el-option value="">请选择</el-option>
            <el-option
              v-for="item in cityOptions"
              :key="item.cityId"
              :label="item.cityName"
              :value="item.cityId" />
          </el-select>
          <el-select v-model="formInline.countryId" style="width: 150px;">
            <el-option value="">请选择</el-option>
            <el-option
              v-for="item in countryOptions"
              :key="item.countryId"
              :label="item.countryName"
              :value="item.countryId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-circle-plus" @click="routeTo('/school/detail?type=add')">添加学校</el-button>
      <el-upload
        :on-success="onSuccess"
        :on-progress="startUpload"
        :show-file-list="false"
        :action="uploadUrl"
        :headers="headers"
        name="uploadExcel"
        accept=".xlsx,.xls"
        class="upload-demo">
        <el-button size="small" type="success" class="el-icon-upload">导入</el-button>
      </el-upload>
      <el-button type="success" size="small" class="el-icon-download" @click="down('/excelTemplate/导入学校模板.xlsx')">模版下载</el-button>
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
            <el-dropdown trigger="click" style="margin-left: 11px;" @command="handleCommand">
              <el-button type="text" size="small">更多<i class="el-icon-arrow-down el-icon--right"/></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="dropdownCallback(scope.row.schoolId,'修改')">
                  <el-button type="text" size="small">修改</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-if="scope.row.enableFlag == 1" :command="dropdownCallback(scope.row.schoolId,'禁用')">
                  <el-button type="text" size="small">禁用</el-button>
                </el-dropdown-item>
                <el-dropdown-item v-else :command="dropdownCallback(scope.row.schoolId,'启用')">
                  <el-button type="text" size="small">启用</el-button>
                </el-dropdown-item>
                <el-dropdown-item :command="dropdownCallback(scope.row.schoolId,'绑定书柜')">
                  <el-button type="text" size="small">绑定书柜</el-button>
                </el-dropdown-item>
                <el-dropdown-item :command="dropdownCallback(scope.row.schoolId,'书籍管理')">
                  <el-button type="text" size="small">书籍管理</el-button>
                </el-dropdown-item>
                <el-dropdown-item :command="dropdownCallback(scope.row.schoolId,'充值设置')">
                  <el-button type="text" size="small">充值设置</el-button>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
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
import { SYSTEM } from '@/api/apiMaps'
import { getToken } from '@/utils/auth'
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
      dialogTableVisible: false,
      activeName: 'self',
      formInline: {
        schoolAccountOrName: '',
        provinceId: '',
        cityId: '',
        countryId: '',
        pageNum: 1,
        pageSize: 10
      },
      provinceOptions: [],
      cityOptions: [],
      countryOptions: [],
      ajaxLoading: null,
      uploadUrl: SYSTEM.SCHOOL.IMPORTSCHOOL,
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
  computed: {
    headers() {
      return {
        'AGENT_SESSION_ID': getToken()
      }
    }
  },
  created() {
    this.fetchData()
    this.getProvince()
  },
  methods: {
    toRMB: value => {
      return `${(value / 100).toFixed(2)}` - 0
    },
    toCents: value => {
      return `${value * 100}`
    },
    onSubmit() {
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    cellDialogStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:10px 0'
    },
    getProvince() {
      api.getProvince().then(response => {
        this.provinceOptions = response.data
      }).catch(() => {

      })
    },
    getCity(provinceId) {
      if (provinceId !== '') {
        api.getCity(provinceId).then(response => {
          this.cityOptions = response.data
          this.formInline.cityId = ''
          this.formInline.countryId = ''
        }).catch(() => {

        })
      } else {
        this.formInline.cityId = ''
        this.formInline.countryId = ''
        this.cityOptions = []
        this.countryOptions = []
      }
    },
    getCountry(cityId) {
      if (cityId !== '') {
        api.getCountry(cityId).then(response => {
          this.countryOptions = response.data
          this.formInline.countryId = ''
        }).catch(() => {

        })
      } else {
        this.formInline.countryId = ''
        this.countryOptions = []
      }
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
    startUpload(event, file, fileList) {
      this.ajaxLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    onSuccess(response, file, fileList) {
      this.ajaxLoading.close()
      if (response.code === 0 && response.data && response.data.length >= 0) {
        let html = ''
        response.data.forEach(function(value, index) {
          html += '<p>' + value + '</p>'
        })
        this.$alert(html, '错误信息', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          callback: () => {
          }
        })
      } else if (response.code === 10000) {
        this.fetchData()
      } else if (response.code === 0) {
        this.$message.error(response.message)
      }
    },
    down(url) {
      api.download(url)
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
    },
    dropdownCallback(schoolId, type) {
      return {
        schoolId: schoolId,
        type: type
      }
    },
    handleCommand(command) {
      if (command.type === '修改') {
        this.routeTo('/school/detail?type=edit', command.schoolId)
      } else if (command.type === '禁用') {
        this.prohibit(command.schoolId, 0)
      } else if (command.type === '启用') {
        this.prohibit(command.schoolId, 1)
      } else if (command.type === '绑定书柜') {
        this.routeTo('/school/bookcaseDetail', command.schoolId)
      } else if (command.type === '书籍管理') {
        this.routeTo('/books/index', command.schoolId)
      } else if (command.type === '充值设置') {
        this.rechargeSet(command.schoolId)
      }
    }
  }
}
</script>

<style>
.school-container{
  margin: 20px;
}
.school-container .operation-container{
  margin-bottom: 20px;
}
.school-container .upload-demo{
  display: inline-block;
}
.school-container .box-card{
  width: 300px;
}
.school-container .box-card p{
  height: 25px;
  line-height: 25px;
  margin: 0;
  font-size: 13px;
  color: #b58585;
}
.school-container .box-card .el-card__body{
  padding: 5px;
}
.school-container .tableList{
  max-height: 245px;
  overflow: auto;
}
.school-container .el-dialog__body{
  padding-top: 10px;
  padding-bottom: 0;
}
.school-container .el-input-number{
  width: 100px;
}
</style>
