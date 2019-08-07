<template>
  <div class="borrowing-anomalous-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="学校名称/账户">
          <el-autocomplete
            v-model="schoolName"
            :fetch-suggestions="searchSchool"
            :debounce="700"
            :clearable="true"
            :trigger-on-focus="false"
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
            :debounce="700"
            :clearable="true"
            :trigger-on-focus="false"
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
        <el-form-item label="异常时间">
          <el-date-picker
            v-model="time"
            :picker-options="pickerOptions"
            unlink-panels
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
    <!--  <div class="operation-container">
    <el-button-group style="margin-right: 20px;">
    <el-button v-if="activeTab === 'locking'" type="primary" size="small" @click="switchList('locking')">异常</el-button>
    <el-button v-else size="small" @click="switchList('locking')">锁定</el-button>
    <el-button v-if="activeTab === 'all'" type="primary" size="small" @click="switchList('all')">全部</el-button>
    <el-button v-else size="small" @click="switchList('all')">全部</el-button>
    </el-button-group>
    </div>-->
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
        <el-table-column label="学校名称" align="center" prop="schoolName" width="120"/>
        <el-table-column label="学校账号" align="center" prop="schoolAccount" width="120"/>
        <el-table-column label="年级-班级" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.gradeName }} - {{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="studentName" width="150"/>
        <el-table-column label="学生状态" align="center" prop="studentStatusStr" width="100"/>
        <el-table-column label="操作类型" align="center" prop="brTypeStr" width="100"/>
        <el-table-column label="柜门状态" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.gridStatusStr === '打开'" style="color: red;">{{ scope.row.gridStatusStr }}</span>
            <span v-else>{{ scope.row.gridStatusStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="异常时间" align="center" prop="createTime" width="200"/>
        <el-table-column label="异常处理时间" align="center" prop="processTime" width="200"/>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="showDialog(scope.row.batchId, scope.row.brTypeStr, scope.row.processStatus)">异常详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :visible.sync="dialogTableVisible" :width="dialogWidth" :title="dialogTitle" :close-on-click-modal="false">
      <div class="dialogStatus">当前状态：{{ dialogStatus }}</div>
      <el-row class="info">
        <el-col :span="8"><div>当前学生：{{ dialogData.studentName }}/{{ dialogData.gradeName }}-{{ dialogData.className }}</div></el-col>
        <el-col :span="16"><div>家长联系方式：{{ dialogData.parentPhone }}（{{ dialogData.familyRelationName }}）</div></el-col>
      </el-row>
      <el-row class="info">
        <el-col :span="8"><div>所属学校：{{ dialogData.schoolName }}/{{ dialogData.schoolAccount }}</div></el-col>
        <el-col v-if="dialogData.teacherPhone" :span="16"><div>学校对接人员：{{ dialogData.teacherPhone }}（{{ dialogData.teacherName }}）</div></el-col>
        <el-col v-else :span="16"><div>学校对接人员：<el-button type="text" size="small" @click="jumpSchoolDetail(dialogData.schoolId)">未添加联系人（点击添加）</el-button></div></el-col>
      </el-row>
      <el-table
        v-loading="dialogLoading"
        :data="dialogList"
        :cell-style="cellDialogStyle"
        :span-method="objectSpanMethod"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row>
        <el-table-column property="createTime" label="异常生成时间" width="110" align="center"/>
        <el-table-column property="updateTime" label="记录更新时间" width="110" align="center"/>
        <el-table-column property="bookcaseNum" label="书柜编码" width="110" align="center"/>
        <el-table-column label="异常柜号" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bookcaseRow != 0">{{ scope.row.bookcaseRow }}{{ scope.row.bookcaseColumn >= 10 ? scope.row.bookcaseColumn : '0' + scope.row.bookcaseColumn }}</span>
          </template>
        </el-table-column>
        <el-table-column property="gridStatusStr" label="柜门状态" align="center"/>
        <el-table-column label="借阅书籍" width="150" align="center">
          <template slot-scope="scope">
            <span>《{{ scope.row.bookName }}》</span>
          </template>
        </el-table-column>
        <el-table-column property="bookStatusNeedStr" label="借阅类型" align="center"/>
        <el-table-column label="书籍状态" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.bookStatusRealStr === '未取走' || scope.row.bookStatusRealStr =='未归还' " style="color: red;">{{ scope.row.bookStatusRealStr }}</span>
            <span v-else>{{ scope.row.bookStatusRealStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="处理方式1" width="220" align="center">
          <template slot-scope="scope">
            <span>1、联系家长说明异常情况，预约时间到学校现场处理；</span><br>
            <span>2、通过书柜管理员界面操作【异常处理】，按提示操作；</span>
          </template>
        </el-table-column>
        <el-table-column label="处理方式2" width="100" align="center">
          <template slot-scope="scope">
            <span v-if="dialogStatus == '已处理'">开启家长<br>自助处理</span>
            <el-button v-else-if="dialogData.parentSelfStatus == 0" type="text" size="small" @click="selfHelp(dialogData.batchId, dialogData.parentSelfStatus)">开启家长<br>自助处理</el-button>
            <el-button v-else type="text" size="small" @click="selfHelp(dialogData.batchId, dialogData.parentSelfStatus)">取消家长<br>自助处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="tips">
        <p>注：1、【处理方式1】说明：</p>
        <p style="text-indent: 3rem;">①让学校对接老师或维护人员到现场，通过书柜上的管理员界面操作【异常处理】，按屏幕上的提示操作。</p>
        <p style="text-indent: 1.5rem;">2、【处理方式2】说明：</p>
        <p style="text-indent: 3rem;">①事先联系家长告知异常情况，要求带上有在借书籍和借阅卡到书柜现场；</p>
        <p style="text-indent: 3rem;">②点击【开启家长自助处理】，让家长在书柜刷卡区刷卡，按屏幕提示操作即可。</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogTableVisible = false" >关 闭</el-button>
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
      // activeTab: 'locking',
      dialogTableVisible: false,
      dialogTitle: '换书异常',
      dialogStatus: '已处理',
      dialogLoading: true,
      dialogList: null,
      dialogData: {},
      dialogWidth: '1200px',
      total: 0,
      schoolName: '',
      studentName: '',
      time: '',
      formInline: {
        schoolId: '',
        studentId: '',
        studentStatus: '0',
        beginCreateTime: '',
        endCreateTime: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '不可借'
      }, {
        value: '1',
        label: '正常'
      }],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
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
    cellDialogStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:5px'
    },
    computeDate() {
      if (this.time) {
        this.formInline.beginCreateTime = this.time[0]
        this.formInline.endCreateTime = this.time[1]
      } else {
        this.formInline.beginCreateTime = ''
        this.formInline.endCreateTime = ''
      }
    },
    fetchData() {
      this.listLoading = true
      api.getBorrowAnomalousList(this.formInline).then(response => {
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
    // switchList(type) {
    //   this.activeTab = type
    //   this.fetchData()
    // },
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
    showDialog(id, title, status) {
      this.dialogLoading = true
      this.dialogTableVisible = true
      this.dialogTitle = title
      if (status) {
        this.dialogStatus = '已处理'
      } else {
        this.dialogStatus = '未处理'
      }
      api.getBorrowAnomalousListDetail({
        batchId: id
      }).then(res => {
        this.dialogLoading = false
        if (res.code === 10000) {
          this.dialogList = res.data.list
          this.dialogData = res.data
        }
      }).catch(err => {
        this.dialogLoading = false
        console.log(err)
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 这里rowspan为1是行有一行合并,colspan为3是列有3列合并,你要合并几行几列就写上相应的数字
      if (this.dialogList.length === 2) {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 6 || columnIndex === 8 || columnIndex === 9) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      } else {
        if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 3 || columnIndex === 4 || columnIndex === 8 || columnIndex === 9) {
          if (rowIndex % 4 === 0) {
            return {
              rowspan: 4,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else if (columnIndex === 6) {
          if (rowIndex % 2 === 0) {
            return {
              rowspan: 2,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      }
    },
    jumpSchoolDetail(id) {
      this.$router.push({
        path: '/school/detail?type=edit&schoolId=' + id
      })
    },
    selfHelp(id, parentSelfStatus) {
      let warnText = ''
      if (parentSelfStatus) {
        warnText = '是否要取消家长自助处理？'
      } else {
        warnText = '是否要开启家长自助处理？建议在家长到书柜现场后再开启！'
      }
      this.$confirm(warnText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.borrowAnomalousSelfHelp({
          batchId: id,
          parentSelfStatus: parentSelfStatus ? 0 : 1
        }).then(res => {
          if (res.code === 10000) {
            api.getBorrowAnomalousListDetail({
              batchId: id
            }).then(res => {
              this.dialogLoading = false
              if (res.code === 10000) {
                this.dialogList = res.data.list
                this.dialogData = res.data
              }
            }).catch(err => {
              this.dialogLoading = false
              console.log(err)
            })
          } else {
            this.$message.error('操作失败')
          }
        }).catch(err => {
          this.$message.error('操作失败')
          console.log(err)
        })
      }).catch(() => {

      })
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
  .borrowing-anomalous-container .dialogStatus{
    font-size: 16px;
    color: #fcd000;
    margin:10px 0 20px 0;
  }
  .borrowing-anomalous-container .tips {
    color: #888;
    font-size: 12px;
    margin-top: 10px;
  }
  .borrowing-anomalous-container .tips p{
    padding: 0;
    margin-top: 0;
  }
</style>
