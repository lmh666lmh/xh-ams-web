<template>
  <div class="edit-container">
    <el-row :gutter="50">
      <el-col :span="6"><span class="title">学校名称：</span>{{ schoolName }}</el-col>
      <el-col :span="6"><span class="title">学校账号：</span>{{ schoolAccount }}</el-col>
    </el-row>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-circle-plus" @click="open()">新增书柜</el-button>
      <el-button size="small" @click="routeTo('/school/index')">返回</el-button>
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
        <el-table-column label="书柜编码" width="250" align="center">
          <template slot-scope="scope" >
            <el-select v-model="scope.row.bookcaseNum" disabled size="mini" placeholder="请选择">
              <el-option
                v-for="item in BookcaseCode"
                :key="item.bookcaseId"
                :label="item.bookcaseNum"
                :value="item.bookcaseId" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="绑定状态" width="110" align="center" prop="bookcaseStatusStr"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="bindBookcase(scope.row.bookcaseId, 0)">取消绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :width="formLabelWidth" :close-on-click-modal="false" title="新增书柜">
      <el-form :model="form">
        <el-form-item label="书柜编码">
          <el-select v-model="form.bookcaseId" size="mini" placeholder="请选择">
            <el-option
              v-for="item in BookcaseCode"
              :key="item.bookcaseId"
              :label="item.bookcaseNum"
              :value="item.bookcaseId" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'BindBookcase',
  data() {
    return {
      dialogFormVisible: false,
      schoolId: '',
      schoolName: '',
      schoolAccount: '',
      listLoading: true,
      list: [],
      BookcaseCode: [],
      form: {
        bookcaseId: ''
      },
      formLabelWidth: '500px'
    }
  },
  created() {
    this.schoolId = this.$route.query.schoolId
    this.SchoolBookcaseList()
  },
  methods: {
    SchoolBookcaseList() {
      this.listLoading = true
      api.getSchoolBookcaseList({
        schoolId: this.schoolId
      }).then(response => {
        this.schoolName = response.data.schoolName
        this.schoolAccount = response.data.schoolAccount
        this.list = response.data.list
        this.listLoading = false
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    routeTo(path) {
      this.$router.push({
        path: path
      })
    },
    getBookcaseCode(callback) {
      api.schoolBookcaseCode({
        bookcaseStatus: 0
      }).then(response => {
        this.BookcaseCode = response.data
        if (callback) {
          callback()
        }
      })
    },
    open() {
      this.listLoading = true
      this.getBookcaseCode(() => {
        this.listLoading = false
        this.dialogFormVisible = true
      })
    },
    add() {
      this.listLoading = true
      this.bindBookcase(this.form.bookcaseId, 1, () => {
        this.listLoading = false
        this.dialogFormVisible = false
        this.form.bookcaseId = ''
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.form.bookcaseId = ''
    },
    bindBookcase(id, type, callback) {
      if (type === 0) {
        this.$confirm('是否确认取消绑定？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          api.schoolBookcaseBinding({
            schoolId: this.schoolId,
            bookcaseId: id,
            bookcaseStatus: type
          }).then(response => {
            this.listLoading = false
            if (response.code === 10000) {
              this.$message({
                message: '取消绑定成功！',
                type: 'success'
              })
              if (callback) {
                callback()
              }
              this.SchoolBookcaseList()
            } else {
              this.$message({
                message: '取消绑定失败！',
                type: 'error'
              })
            }
          })
        }).catch(() => {

        })
      } else {
        api.schoolBookcaseBinding({
          schoolId: this.schoolId,
          bookcaseId: id,
          bookcaseStatus: type
        }).then(response => {
          this.listLoading = false
          if (response.code === 10000) {
            this.$message({
              message: '绑定成功！',
              type: 'success'
            })
            if (callback) {
              callback()
            }
            this.SchoolBookcaseList()
          } else {
            this.$message({
              message: '绑定失败！',
              type: 'error'
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .edit-container{
    padding: 10px;
  }
  .operation-container{
    margin: 20px 20px 20px 0;
  }
  .list{
    width: 656px;
  }
  .title{
    font-size: 16px;
    color: #67C23A;
  }
</style>
