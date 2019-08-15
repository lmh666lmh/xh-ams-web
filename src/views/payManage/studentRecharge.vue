<template>
  <div class="pay-statistics-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>学校名字</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <GradeClass :school-id="formInline.schoolId" :grade-id.sync="formInline.gradeId" :class-id.sync="formInline.classId"/>
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.studentName" placeholder="请输入学生姓名"/>
        </el-form-item>
        <el-form-item label="会员状态">
          <el-select v-model="formInline.memberStatus" placeholder="请选择">
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
        <el-table-column align="center" label="序号" width="95">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="年级" align="center" prop="gradeName"/>
        <el-table-column label="班级" align="center" prop="className"/>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column label="付费状态" align="center" prop="averageScoreStr"/>
        <el-table-column label="付费路径" align="center" prop="averageScoreStr"/>
        <el-table-column label="套餐类型" align="center" prop="averageScoreStr"/>
        <el-table-column label="会员有效期" align="center" prop="averageScoreStr"/>
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
      formInline: {
        schoolId: '',
        gradeId: '',
        classId: '',
        studentName: '',
        memberStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
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
      }]
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
  },
  methods: {
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
</style>
