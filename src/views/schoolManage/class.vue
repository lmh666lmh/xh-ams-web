<template>
  <div class="school-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="年级名称">
          <el-select v-model="formInline.gradeId" style="width: 150px;">
            <el-option value="">请选择</el-option>
            <el-option
              v-for="item in gradeOptions"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId" />
          </el-select>
        </el-form-item>
        <el-form-item label="班级名称">
          <el-input v-model="formInline.className" placeholder="请输入班级名称"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-circle-plus" @click="editClass('add')">新增班级</el-button>
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
        <el-table-column label="班级名称" align="center" prop="className"/>
        <el-table-column label="创建时间" align="center" prop="classCreateTime"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editClass('edit', scope.row.classId)" >修改</el-button>
            <el-button type="text" size="small" @click="deleteClass(scope.row.classId)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :width="formWidth" :close-on-click-modal="false" @close="closeDialog('form')">
      <el-form ref="form" :model="form" :rules="rules" size="small">
        <el-form-item :label-width="formLabelWidth" label="班级名称" prop="className">
          <el-input v-model="form.className" style="width: 200px;" maxlength="32"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="请选择年级" prop="gradeId">
          <el-select v-model="form.gradeId" placeholder="请选择年级">
            <el-option
              v-for="item in gradeOptions"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId" />
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
  name: 'Class',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      gradeOptions: [],
      classId: '',
      formInline: {
        schoolId: '',
        gradeId: '',
        className: '',
        pageNum: 1,
        pageSize: 10
      },
      dialogFormVisible: false,
      formWidth: '500px',
      formLabelWidth: '100px',
      title: '',
      form: {
        className: '',
        gradeId: ''
      },
      rules: {
        className: [
          { required: true, message: '请填写班级名称', trigger: 'blur' }
        ],
        gradeId: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
    this.getGradeAll()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getClassList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getGradeAll() {
      api.getAllGrade(this.formInline.schoolId).then(response => {
        if (response.code === 10000) {
          this.gradeOptions = response.data
        }
      })
    },
    onSubmit() {
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    getClassDetail(classId) {
      api.getClassDetail(classId).then(response => {
        if (response.code === 10000) {
          this.form.className = response.data.className
          this.form.gradeId = response.data.gradeId
        }
      })
    },
    editClass(type, id) {
      this.dialogFormVisible = true
      if (type === 'add') {
        this.title = '新增班级'
      } else {
        this.title = '修改班级'
        this.classId = id
        this.getClassDetail(id)
      }
    },
    deleteClass(classId) {
      this.$confirm('确定要删除当前班级吗？', '提示', {
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
        api.deleteClass(classId).then(response => {
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
          if (this.title === '新增班级') {
            api.addClass({ ...this.form, ...{ schoolId: this.formInline.schoolId }}).then(response => {
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
            api.editClass({ ...this.form, ...{ classId: this.classId }}).then(response => {
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
