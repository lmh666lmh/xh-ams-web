<template>
  <div class="school-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="年级名称">
          <el-input v-model="formInline.gradeName" placeholder="请输入年级名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-circle-plus" @click="editGrade('add')">新增年级</el-button>
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
        <el-table-column label="年级名称" align="center" prop="gradeName"/>
        <el-table-column label="创建时间" align="center" prop="createTime"/>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editGrade('edit', scope.row.gradeId)" >修改</el-button>
            <el-button type="text" size="small" @click="deleteGrade(scope.row.gradeId)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :width="formWidth" :close-on-click-modal="false" @close="closeDialog('form')">
      <el-form ref="form" :model="form" :rules="rules" size="small">
        <el-form-item :label-width="formLabelWidth" label="年级名称" prop="gradeName">
          <el-input v-model="form.gradeName" style="width: 200px;" maxlength="32"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="年级类型" prop="gradeType">
          <el-select v-model="form.gradeType" placeholder="请选择年级类型">
            <el-option
              v-for="item in gradeTypeOptions"
              :key="item.subCode"
              :label="item.subName"
              :value="item.subCode" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'Grade',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      gradeTypeOptions: [],
      gradeId: '',
      formInline: {
        schoolId: '',
        gradeName: '',
        pageNum: 1,
        pageSize: 10
      },
      dialogFormVisible: false,
      formWidth: '500px',
      formLabelWidth: '80px',
      title: '',
      form: {
        gradeName: '',
        gradeType: ''
      },
      rules: {
        gradeName: [
          { required: true, message: '请填写年级名称', trigger: 'blur' }
        ],
        gradeType: [
          { required: true, message: '请选择年级类型', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
    this.getGradeType()
  },
  methods: {
    getGradeType() {
      api.getDictionary('grade_type').then(response => {
        if (response.code === 10000) {
          this.gradeTypeOptions = response.data.grade_type
        }
      })
    },
    fetchData() {
      this.listLoading = true
      api.getGradeList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getGradeDetail(gradeId) {
      api.getGradeDetail(gradeId).then(response => {
        if (response.code === 10000) {
          this.form.gradeName = response.data.gradeName
          this.form.gradeType = response.data.gradeType
        }
      })
    },
    onSubmit() {
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    editGrade(type, id) {
      this.dialogFormVisible = true
      if (type === 'add') {
        this.title = '新增年级'
      } else {
        this.title = '修改年级'
        this.gradeId = id
        this.getGradeDetail(id)
      }
    },
    deleteGrade(gradeId) {
      this.$confirm('确定要删除当前年级吗？', '提示', {
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
        api.deleteGrade(gradeId).then(response => {
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
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          if (this.title === '新增年级') {
            api.addGrade({ ...this.form, ...{ schoolId: this.formInline.schoolId }}).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.dialogFormVisible = false
                this.$message({
                  message: '新增成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error('新增失败')
              }
            }).catch(() => {
              loading.close()
            })
          } else {
            api.editGrade({ ...this.form, ...{ gradeId: this.gradeId }}).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.dialogFormVisible = false
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
                this.fetchData()
              } else {
                this.$message.error('修改失败')
              }
            }).catch(() => {
              loading.close()
            })
          }
        } else {
          return false
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    closeDialog(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.operation-container{
  margin-bottom: 20px;
}
</style>
