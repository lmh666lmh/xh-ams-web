<template>
  <div class="school-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="借阅卡卡号">
          <el-input v-model="formInline.cardNum" placeholder=""/>
        </el-form-item>
        <el-form-item label="绑定状态">
          <el-select v-model="formInline.cardStatus" placeholder="请选择">
            <el-option label="请选择" value=""/>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="学校名称/账号">
          <el-input v-model="formInline.schoolAccountOrName" placeholder=""/>
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
        <el-table-column label="借阅卡卡号" align="center" prop="cardNum"/>
        <el-table-column label="绑定学校名称" align="center" prop="schoolName"/>
        <el-table-column label="绑定学校账号" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="routeTo('/school/detail?type=detail', scope.row.schoolId)" >{{ scope.row.schoolAccount }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center" prop="cardStatusStr"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.cardStatus != 2" type="text" size="small" @click="reportLose(scope.row.borrowCardId, 2)">挂失</el-button>
            <el-button v-if="scope.row.cardStatus != 1" type="text" size="small" @click="deleteCard(scope.row.borrowCardId)">删除</el-button>
            <el-button v-if="scope.row.cardStatus == 2" type="text" size="small" @click="reportLose(scope.row.borrowCardId, 1)">取消挂失</el-button>
            <el-button v-if="scope.row.cardStatus == 1" type="text" size="small" @click="unbound(scope.row.borrowCardId)">解除绑定</el-button>
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
  name: 'BorrowCardManage',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        cardNum: '',
        cardStatus: '',
        schoolAccountOrName: '',
        pageNum: 1,
        pageSize: 10
      },
      stateOptions: [{
        value: '0',
        label: '未绑定'
      }, {
        value: '1',
        label: '已绑定'
      }, {
        value: '2',
        label: '挂失'
      }]
    }
  },
  created() {
    this.formInline.cardStatus = this.$route.query.cardStatus ? this.$route.query.cardStatus : ''
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getEquipmentBorrowCardList(this.formInline).then(response => {
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
      return 'padding:0'
    },
    reportLose(borrowCardId, cardStatus) {
      let warnText = ''
      if (cardStatus === 1) {
        warnText = '是否要取消挂失？'
      } else {
        warnText = '是否挂失？'
      }
      this.$confirm(warnText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        api.equipmentBorrowCardLose({
          borrowCardId: borrowCardId,
          cardStatus: cardStatus
        }).then(response => {
          loading.close()
          if (response.code === 10000) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error('操作失败')
          }
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {
      })
    },
    deleteCard(params) {
      this.$confirm('确定要删除当前借阅卡吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        api.equipmentBorrowCardDelete(params).then(response => {
          loading.close()
          if (response.code === 10000) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error('删除失败')
          }
        }).catch(() => {
          loading.close()
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
    unbound(borrowCardId) {
      this.$confirm('确定要解绑当前借阅卡吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        api.equipmentBorrowCardUnBound(borrowCardId).then(response => {
          loading.close()
          if (response.code === 10000) {
            this.$message({
              message: '解绑成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error('解绑失败')
          }
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped>
  .school-container{
    margin: 20px;
  }
</style>
