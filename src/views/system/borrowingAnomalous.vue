<template>
  <div class="borrowing-anomalous-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学校名称/账户">
          <el-autocomplete
            v-model="schoolName"
            :fetch-suggestions="searchSchool"
            popper-class="my-autocomplete"
            placeholder="请填写"
            @select="searchSchoolSelect">
            <i slot="suffix" class="el-icon-search el-input__icon"/>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">账号：{{ item.schoolAccount }}</span>
              <span class="addr">编码：{{ item.schoolNum }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-autocomplete
            v-model="studentName"
            :fetch-suggestions="searchStudent"
            popper-class="my-autocomplete"
            placeholder="请填写"
            @select="searchStudentSelect">
            <i slot="suffix" class="el-icon-search el-input__icon"/>
            <template slot-scope="{ item }">
              <div class="name">{{ item.value }}</div>
              <span class="addr">所在学校：{{ item.schoolName }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="学生状态">
          <el-select v-model="formInline.studentStatus" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="借还时间">
          <el-date-picker
            v-model="time"
            type="daterange"
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
    <div class="operation-container">
      <el-button-group style="margin-right: 20px;">
        <el-button v-if="activeTab === 'locking'" type="primary" size="small" @click="switchList('locking')">锁定</el-button>
        <el-button v-else size="small" @click="switchList('locking')">锁定</el-button>
        <el-button v-if="activeTab === 'all'" type="primary" size="small" @click="switchList('all')">全部</el-button>
        <el-button v-else size="small" @click="switchList('all')">全部</el-button>
      </el-button-group>
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
        <el-table-column label="年级-班级" align="center" prop="schoolNum">
          <template slot-scope="scope">
            <span>{{ scope.row.gradeName }} - {{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="studentName" width="120"/>
        <el-table-column label="学生状态" align="center" prop="bookStatusStr"/>
        <el-table-column label="异常状态" align="center" prop="bookStatusStr"/>
        <el-table-column label="借还时间" align="center" prop="createTime" width="200"/>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDialog()">进入解锁</el-button>
            <el-button type="text" size="small">查看监控</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :visible.sync="dialogTableVisible" :title="dialogTitle" :close-on-click-modal="false">
      <el-row class="info">
        <el-col :span="8"><div>当前学生：小星星/小一班-陈一凡</div></el-col>
        <el-col :span="16"><div>家长联系方式：1785454646（妈妈）</div></el-col>
      </el-row>
      <el-row class="info">
        <el-col :span="8"><div>所属学校：亲禾幼儿园/1614454446</div></el-col>
        <el-col :span="16"><div>学校维护人员：1785454646（林老师）</div></el-col>
      </el-row>
      <el-table
        v-loading="dialogLoading"
        :data="dialogList"
        :cell-style="cellStyle"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row>
        <el-table-column property="schoolName" label="书柜编号"/>
        <el-table-column property="schoolName" label="异常柜号"/>
        <el-table-column property="schoolName" label="借阅书籍"/>
        <el-table-column property="schoolName" label="书籍状态"/>
        <el-table-column property="schoolName" label="借还时间"/>
        <el-table-column property="schoolName" label="异常描述"/>
        <el-table-column property="schoolName" label="处理方式"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogTableVisible = false" >取 消</el-button>
        <el-button size="small" type="primary" @click="dialogTableVisible = false">确认解锁</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'BorrowingAnomalous',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      activeTab: 'locking',
      dialogTableVisible: false,
      dialogTitle: '换书异常',
      dialogLoading: true,
      dialogList: null,
      total: 0,
      schoolName: '',
      studentName: '',
      time: '',
      formInline: {
        schoolId: '',
        studentId: '',
        studentStatus: '',
        createTime: '',
        returnTime: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '2',
        label: '在借'
      }, {
        value: '1',
        label: '已还'
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
    onSubmit() {
      this.formInline.pageNum = 1
      if (!this.schoolName) {
        this.formInline.schoolId = ''
      }
      if (!this.studentName) {
        this.formInline.studentId = ''
      }
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    computeDate() {
      if (this.time) {
        this.formInline.createTime = this.time[0]
        this.formInline.returnTime = this.time[1]
      } else {
        this.formInline.createTime = ''
        this.formInline.returnTime = ''
      }
    },
    fetchData() {
      this.listLoading = true
      api.getBorrowRecordList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    routeTo(path) {
      this.$router.push({
        path: path
      })
    },
    switchList(type) {
      this.activeTab = type
      this.fetchData()
    },
    searchSchool(queryString, callback) {
      this.formInline.schoolId = ''
      const searchKey = queryString.trim()
      if (!searchKey) {
        callback([])
      } else {
        api.getSearchSchool({
          searchKey: searchKey
        }).then(res => {
          if (res.code === 10000) {
            const array = []
            res.data.forEach((value, index) => {
              array.push({
                value: value.schoolName,
                schoolId: value.schoolId,
                schoolNum: value.schoolNum,
                schoolAccount: value.schoolAccount
              })
            })
            // 调用 callback 返回建议列表的数据
            callback(array)
          } else {
            callback([])
          }
        }).catch(err => {
          callback([])
          console.log(err)
        })
      }
    },
    searchStudent(queryString, callback) {
      this.formInline.studentId = ''
      const searchKey = queryString.trim()
      if (!searchKey) {
        callback([])
      } else {
        api.getSearchStudent({
          searchKey: searchKey
        }).then(res => {
          if (res.code === 10000) {
            const array = []
            res.data.forEach((value, index) => {
              array.push({
                value: value.studentName,
                studentId: value.studentId,
                schoolName: value.schoolName
              })
            })
            // 调用 callback 返回建议列表的数据
            callback(array)
          } else {
            callback([])
          }
        }).catch(err => {
          callback([])
          console.log(err)
        })
      }
    },
    searchSchoolSelect(item) {
      console.log(item)
      this.formInline.schoolId = item.schoolId
    },
    searchStudentSelect(item) {
      console.log(item)
      this.formInline.studentId = item.studentId
    },
    showDialog(type) {
      this.dialogLoading = false
      this.dialogTableVisible = true
    }
  }
}
</script>

<style>
  .borrowing-anomalous-container{
    margin: 20px;
  }
  .borrowing-anomalous-container .operation-container{
    margin-bottom: 20px;
  }
  .el-date-editor {
    width: 260px !important;
  }
  .el-range-separator {
    display: inline-block !important;
    width: 20px !important;
    padding: 0 !important;
  }
  .my-autocomplete li {
    line-height: normal;
    padding: 7px;
  }
  .my-autocomplete .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .my-autocomplete .addr {
    font-size: 12px;
    color: #b4b4b4;
    display: block;
    text-indent: 1rem;
  }
  .my-autocomplete .highlighted .addr {
    color: #ddd;
  }
  .borrowing-anomalous-container .bookDetail {
    color: #409EFF;
    cursor: pointer;
    margin: 5px 0;
  }
  .borrowing-anomalous-container .el-dialog__body{
    padding: 0 20px !important;
  }
  .borrowing-anomalous-container .info{
    margin-bottom: 20px;
  }
</style>
