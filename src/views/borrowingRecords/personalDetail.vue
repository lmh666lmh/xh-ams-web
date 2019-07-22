<template>
  <div class="borrowing-container">
    <div class="info-container">
      <span><span class="info-title">当前学生：</span>小星星-小一班-陈一凡</span>
      <span><span class="info-title">所属学校：</span>亲禾幼儿园</span>
      <span><span class="info-title">学校账号：</span>亲禾幼儿园</span>
      <el-button type="primary" size="small" @click="back">返回</el-button>
    </div>
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="借阅书籍">
          <el-input v-model="formInline.schoolAccountOrName" placeholder="请填写"/>
        </el-form-item>
        <el-form-item label="借阅状态">
          <el-select v-model="formInline.bookcaseStatus" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="借/还书时间">
          <el-date-picker
            v-model="formInline.birthday"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-download" @click="down('/excelTemplate/导入学校模板.xlsx')">导出借阅记录</el-button>
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
        <el-table-column label="书柜编号" align="center" prop="schoolName"/>
        <el-table-column label="借阅书籍" align="center" prop="schoolName"/>
        <el-table-column label="借阅状态" align="center" prop="schoolAccount" width="120"/>
        <el-table-column label="柜号-借" align="center" prop="schoolNum"/>
        <el-table-column label="柜号-还" align="center" prop="leaderName"/>
        <el-table-column label="借书时间" align="center" prop="areaName"/>
        <el-table-column label="还书时间" align="center" prop="address"/>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <div class="tips">
      <p>注：1、点击【借阅书籍】下的书籍，可查看该书籍下的所有学生借阅记录；</p>
      <p style="text-indent: 1.5rem;">2、点击【柜号】下的书柜号，可查看该柜号下的所有学生借阅记录；</p>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'PersonalDetail',
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
        provinceId: '',
        cityId: '',
        countryId: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '0',
        label: '再借'
      }, {
        value: '1',
        label: '已还'
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    onSubmit() {
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
    routeTo(path) {
      this.$router.push({
        path: path,
        query: {
          schoolId: arguments[1]
        }
      })
    },
    back() {

    }
  }
}
</script>

<style>
  .borrowing-container{
    margin: 20px;
  }
  .borrowing-container .operation-container{
    margin-bottom: 20px;
  }
  .borrowing-container .info-container{
    margin-bottom: 20px;
  }
  .borrowing-container .info-container>span{
    margin-right: 50px;
  }
  .borrowing-container .info-container .info-title{
    color: #fcd000;
  }
  .borrowing-container .tips {
    color: #ccc;
    font-size: 12px;
  }
  .borrowing-container .tips p{
    padding: 0;
    margin-top: 0;
  }
  .el-date-editor {
    width: 260px !important;
  }
  .el-range-separator {
    padding: 0 !important;
  }
</style>
