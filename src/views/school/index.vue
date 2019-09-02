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
        :on-error="onError"
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
        <el-table-column label="学校邀请码" align="center" prop="schoolNum"/>
        <el-table-column label="园长姓名" align="center" prop="leaderName"/>
        <el-table-column label="联系方式" align="center" prop="leaderPhone" width="120"/>
        <el-table-column label="城市区域" align="center" prop="areaName"/>
        <el-table-column label="详细地址" align="center" prop="address"/>
        <el-table-column :render-header="renderSchoolQR" label="学校二维码" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.schoolQcUrl" class="school-qr">
          </template>
        </el-table-column>
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
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      uploadUrl: SYSTEM.SCHOOL.IMPORTSCHOOL
    }
  },
  computed: {
    headers() {
      return {
        'AGENT_SESSION_ID': getToken()
      }
    },
    ...mapGetters([
      'setPayPwd'
    ])
  },
  created() {
    this.fetchData()
    this.getProvince()
    if (!this.setPayPwd) {
      this.$confirm('您暂未设置订单支付密码，请先设置支付密码', '提示', {
        confirmButtonText: '去设置',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.routeTo('/payPassword')
      }).catch(() => {
      })
    }
  },
  methods: {
    renderSchoolQR(h, { column }) {
      return [
        column.label,
        h(
          'el-tooltip',
          {
            props: {
              content: '右键图片存储为即可下载',
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
    onError(err, file, fileList) {
      this.ajaxLoading.close()
      this.$message({
        message: '导入失败',
        type: 'error'
      })
      console.log(err)
    },
    down(url) {
      api.download(url)
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
.school-container .school-qr{
  width: 100px;
  height: 100px;
  margin-top: 10px;
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
