<template>
  <div class="school-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="老师名称">
          <el-input v-model="formInline.teacherName" placeholder="请输入老师名称"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInline.phone" placeholder="请输入手机号"/>
        </el-form-item>
        <el-form-item label="任教/管理班级">
          <el-select v-model="formInline.gradeId" placeholder="请选择年级" style="width: 150px;" @change="getClass('search', formInline.gradeId)">
            <el-option value="">请选择年级</el-option>
            <el-option
              v-for="item in gradeOptions"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId" />
          </el-select>
          <el-select v-model="formInline.classId" placeholder="请选择班级" style="width: 150px;">
            <el-option value="">请选择班级</el-option>
            <el-option
              v-for="item in classOptions"
              :key="item.classId"
              :label="item.className"
              :value="item.classId" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位">
          <el-select v-model="formInline.teacherType" placeholder="请选择">
            <el-option
              v-for="item in teacherTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="formInline.teacherStatus" placeholder="请选择">
            <el-option
              v-for="item in teacherStatusOptions"
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
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-circle-plus" @click="editTeacher('add')">新增</el-button>
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
        <el-table-column label="老师名字" align="center" prop="teacherName"/>
        <el-table-column label="手机号" align="center" prop="phone"/>
        <el-table-column label="职位" align="center" prop="teacherTypeStr"/>
        <el-table-column label="任教班级" align="center" prop="teacherClassListStr"/>
        <el-table-column label="状态" align="center" prop="teacherStatusStr"/>
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editTeacher('edit', scope.row.teacherId)" >修改</el-button>
            <el-button type="text" size="small" @click="deleteTeacher(scope.row.teacherId)" >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" :width="formWidth" :close-on-click-modal="false" @close="closeDialog('form')">
      <el-form ref="form" :model="form" :rules="rules" size="small">
        <el-form-item :label-width="formLabelWidth" label="老师名称" prop="teacherName">
          <el-input v-model="form.teacherName" style="width: 200px;" maxlength="32"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="职位" prop="teacherType">
          <el-select v-model="form.teacherType" style="width: 200px;" maxlength="32">
            <el-option
              v-for="item in teacherStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="手机号码" prop="phone">
          <el-input v-model="form.phone" style="width: 200px;" maxlength="32"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="性别">
          <el-radio v-model="form.gender" label="man">男</el-radio>
          <el-radio v-model="form.gender" label="woman">女</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="任教班级" prop="teacherClassList" >
          <el-tree :data="allClass" show-checkbox node-key="gradeId" :props="defaultProps"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-radio v-model="form.teacherStatus" label="1">在职</el-radio>
          <el-radio v-model="form.teacherStatus" label="0">离职</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="备注" prop="remake">
          <el-input v-model="form.remake" style="width: 200px;" maxlength="32"/>
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
  name: 'TeacherManage',
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
        teacherName: '',
        phone: '',
        teacherStatus: '',
        teacherType: '',
        classId: '',
        gradeId: '',
        pageNum: 1,
        pageSize: 10
      },
      gradeOptions: [],
      classOptions: [],
      teacherTypeOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: 'teacher',
        label: '教师'
      }, {
        value: 'leader',
        label: '园长'
      }],
      teacherStatusOptions: [{
        value: '',
        label: '请选择'
      }, {
        value: '1',
        label: '在职'
      }, {
        value: '0',
        label: '离职'
      }],
      dialogFormVisible: false,
      formWidth: '500px',
      formLabelWidth: '80px',
      title: '',
      form: {
        teacherId: '',
        teacherName: '',
        teacherType: '',
        phone: '',
        gender: '',
        teacherClassList: [],
        teacherStatus: '',
        remake: ''
      },
      allClass: [],
      menu: [],
      menusIds: [],
      rules: {
        gradeId: [
          { required: true, message: '请选择年级', trigger: 'change' }
        ],
        classId: [
          { required: true, message: '请选择班级', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
    this.getGradeAll()
    this.getAllClassGroup(this.formInline.schoolId)
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getTeacherList(this.formInline).then(response => {
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
    getGradeAll() {
      api.getAllGrade(this.formInline.schoolId).then(response => {
        if (response.code === 10000) {
          this.gradeOptions = response.data
        }
      })
    },
    getClass(type, gradeId) {
      this.classOptions = []
      this.classDialogOptions = []
      if (type === 'search') {
        this.formInline.classId = ''
      } else if (type === 'dialog') {
        this.dialogForm.form.classId = ''
      } else if (type === 'multipleTable') {
        this.multipleTableFormInline.classId = ''
      }
      api.getAllClass({ gradeId: gradeId }).then(response => {
        if (response.code === 10000) {
          if (type === 'search') {
            this.classOptions = response.data
          } else {
            this.classDialogOptions = response.data
          }
        }
      })
    },
    getTeacherDetail(schoolId, teacherId) {
      api.getTeacherDetail({ schoolId: schoolId, teacherId: teacherId }).then(response => {
        if (response.code === 10000) {
          this.form.teacherName = response.data.teacherName
          this.form.questionDTOList = response.data.questionDTOList ? response.data.questionDTOList : []
        }
      })
    },
    getAllClassGroup(schoolId) {
      api.getAllClassGroup({ schoolId: schoolId }).then(response => {
        if (response.code === 10000) {
          this.allClass = response.data ? response.data : []
          console.log(response)
        }
      })
    },
    editTeacher(type, teacherId) {
      this.dialogFormVisible = true
      if (type === 'add') {
        this.title = '新增老师'
      } else {
        this.title = '修改老师'
        this.getTeacherDetail(this.formInline.schoolId, teacherId)
      }
    },
    deleteTeacher(teacherId) {
      this.$confirm('确定要删除当前老师吗？', '提示', {
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
        api.deleteTeacher(teacherId).then(response => {
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
          if (this.title === '新增老师') {
            api.addTeacher({ ...this.form, ...{ schoolId: this.formInline.schoolId }}).then(response => {
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
            api.editTeacher({ ...this.form, ...{ gradeId: this.gradeId }}).then(response => {
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
