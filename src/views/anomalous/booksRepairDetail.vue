<template>
  <div class="books-repair-detail-container">
    <div class="info-container">
      <span><span class="info-title">当前学校：</span>{{ schoolName }}</span>
      <span><span class="info-title">书柜编号：</span>{{ bookcaseNum }}</span>
      <span><span class="info-title">报修书籍：</span>《 {{ bookName }} 》</span>
      <el-button type="primary" size="mini" @click="back">返回</el-button>
    </div>
    <div class="operation-container">
      <span style="color: red;">报修处理选择：</span>
      <el-radio v-model="repairStatus" :label="1">暂不报修</el-radio>
      <el-radio v-model="repairStatus" :label="2">锁柜报修</el-radio>
      <el-button type="primary" size="mini" style="margin-left: 50px;" @click="submit">提交处理</el-button>
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
        <el-table-column label="状态" align="center" prop="readStatusStr"/>
        <el-table-column label="年级-班级" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.gradeName }}-{{ scope.row.className }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报修学生" align="center" prop="studentName"/>
        <el-table-column label="书籍破损图片" align="center" width="220">
          <template slot-scope="scope">
            <img v-for="(item, index) in JSON.parse(scope.row.bookWearoutImgJson)" :key="index" :src="item" :preview="scope.row.id" preview-text="" class="repair-pic">
          </template>
        </el-table-column>
        <el-table-column label="谁破坏的书籍" align="center" prop="wearoutPersonFlagStr"/>
        <el-table-column label="备注" align="center" prop="remark"/>
        <el-table-column label="报修时间" align="center" prop="repairTime"/>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'BooksRepairDetail',
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
      bookcaseNum: '',
      repairStatus: '',
      formInline: {
        bookRfId: '',
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  created() {
    this.formInline.bookRfId = this.$route.query.bookRfId
    this.fetchData()
  },
  methods: {
    back() {
      history.go(-1)
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:10px 0'
    },
    fetchData() {
      this.listLoading = true
      api.getBookRepairDetailList(this.formInline).then(response => {
        this.total = response.data.page.total
        this.list = response.data.page.list
        this.schoolName = response.data.schoolName
        this.bookcaseNum = response.data.bookcaseNum
        this.bookName = response.data.bookName
        this.listLoading = false
        setTimeout(() => {
          this.$previewRefresh()
        }, 2000)
      }).catch(() => {
        this.listLoading = false
      })
    },
    submit() {
      if (this.repairStatus === '') {
        this.$message.warning('请先选择报修方式')
        return
      }
      this.$confirm('是否提交报修处理？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.submitBookRepairDetail({
          bookRfId: this.formInline.bookRfId,
          repairStatus: this.repairStatus
        }).then(res => {
          if (res.code === 10000) {
            this.$message({
              message: '提交成功！',
              type: 'success'
            })
          } else {
            this.$message.err(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
  .books-repair-detail-container{
    margin: 20px;
  }
  .books-repair-detail-container .info-container{
    margin-bottom: 20px;
  }
  .books-repair-detail-container .info-container>span{
    margin-right: 50px;
  }
  .books-repair-detail-container .info-container .info-title{
    color: #92c439;
  }
  .books-repair-detail-container .operation-container{
    padding: 20px;
    border:1px solid #ebeef5;
    border-bottom: 0;
  }
  .books-repair-detail-container .repair-pic{
    max-width: 50px;
    max-height: 50px;
    margin: 0 5px;
    cursor: pointer;
  }
</style>
