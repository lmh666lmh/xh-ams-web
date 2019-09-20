<template>
  <div class="books-repair-container">
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
        <el-form-item label="报修书籍">
          <el-autocomplete
            v-model="bookName"
            :fetch-suggestions="searchBooks"
            :debounce="700"
            :clearable="true"
            :trigger-on-focus="false"
            popper-class="my-autocomplete"
            placeholder="请填写"
            @select="searchBooksSelect">
            <i slot="suffix" class="el-icon-search el-input__icon"/>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="借阅状态">
          <el-select v-model="formInline.bookStatus" placeholder="请选择">
            <el-option
              v-for="item in bookStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="报修进度">
          <el-select v-model="formInline.repairStatus" placeholder="请选择">
            <el-option
              v-for="item in repairStatusOptions"
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
        <el-table-column label="学校名称" align="center" prop="schoolName"/>
        <el-table-column label="学校账号" align="center" prop="schoolAccount"/>
        <el-table-column label="报修书籍" align="center">
          <template slot-scope="scope">
            <span>《{{ scope.row.bookName }}》</span>
          </template>
        </el-table-column>
        <el-table-column label="借阅状态" align="center" prop="bookStatusStr"/>
        <el-table-column label="报修进度" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.repairStatus === 0" style="color: red;">{{ scope.row.repairStatusStr }}</span>
            <span v-else>{{ scope.row.repairStatusStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="锁住柜号" align="center" prop="lockGridNum"/>
        <el-table-column label="最后报修时间" align="center" prop="lastRepairTime"/>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.repairStatus === 0" type="text" size="small" @click="routeTo('/anomalous/booksRepairDetail', scope.row.bookRfId)">处理</el-button>
            <el-button v-else type="text" size="small" @click="routeTo('/anomalous/booksRepairDetail', scope.row.bookRfId)">查看报修</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'BooksRepair',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      schoolName: '',
      bookName: '',
      formInline: {
        schoolId: '',
        bookTemplateId: '',
        bookStatus: '',
        repairStatus: '',
        pageNum: 1,
        pageSize: 10
      },
      bookStatusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '2',
        label: '在借'
      }, {
        value: '1',
        label: '已还'
      }],
      repairStatusOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '待处理'
      }, {
        value: '1',
        label: '暂不处理'
      }, {
        value: '2',
        label: '锁柜报修'
      }, {
        value: '3',
        label: '已处理'
      }]
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
      if (!this.bookName) {
        this.formInline.bookTemplateId = ''
      }
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:10px 0'
    },
    fetchData() {
      this.listLoading = true
      api.getBookRepairList(this.formInline).then(response => {
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
          bookRfId: arguments[1]
        }
      })
    },
    searchSchoolSelect(item) {
      console.log(item)
      this.formInline.schoolId = item.schoolId
    },
    searchBooksSelect(item) {
      console.log(item)
      this.formInline.bookTemplateId = item.bookTemplateId
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
    searchBooks(queryString, callback) {
      this.formInline.bookTemplateId = ''
      const searchKey = queryString.trim()
      if (!searchKey) {
        callback([])
      } else {
        api.getSearchBooks({
          searchKey: searchKey
        }).then(res => {
          if (res.code === 10000) {
            const array = []
            res.data.forEach((value, index) => {
              array.push({
                value: value.bookName,
                bookTemplateId: value.bookTemplateId
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
    }
  }
}
</script>

<style scoped>
  .books-repair-container{
    margin: 20px;
  }
</style>
