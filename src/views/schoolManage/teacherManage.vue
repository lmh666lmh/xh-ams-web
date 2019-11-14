<template>
  <div class="teacher-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="老师名称">
          <el-input v-model="formInline.teacherName" placeholder="请输入老师名称"/>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formInline.phone" placeholder="请输入手机号" maxlength="11"/>
        </el-form-item>
        <GradeClass :school-id="formInline.schoolId" :grade-id.sync="formInline.gradeId" :class-id.sync="formInline.classId"/>
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
        <el-table-column label="状态" align="center" prop="remark"/>
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
          <el-select v-model="form.teacherType" style="width: 200px;">
            <el-option
              v-for="item in teacherTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="手机号码" prop="phone">
          <el-input v-model="form.phone" style="width: 200px;" maxlength="11"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="性别">
          <el-radio v-model="form.gender" label="man">男</el-radio>
          <el-radio v-model="form.gender" label="woman">女</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="任教班级">
          <div style="max-height: 200px; overflow: auto;">
            <el-tree
              ref="tree"
              :data="allClassOptions"
              :props="defaultProps"
              :default-checked-keys="defaultCheckedKeys"
              :default-expanded-keys="defaultExpandedKeys"
              empty-text="请先创建年级班级"
              show-checkbox
              node-key="id"
              @check-change="handleCheckChange"/>
          </div>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="状态">
          <el-radio v-model="form.teacherStatus" :label="1">在职</el-radio>
          <el-radio v-model="form.teacherStatus" :label="0">离职</el-radio>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="备注">
          <el-input v-model="form.remark" style="width: 200px;" maxlength="255"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('form')">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import GradeClass from '@/components/GradeClass'
import { regPhone } from '@/utils/validate'
import { api } from '@/api/index'

export default {
  name: 'TeacherManage',
  components: {
    Pagination,
    GradeClass
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else {
        if (!regPhone(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          callback()
        }
      }
    }
    return {
      list: null,
      listLoading: true,
      total: 0,
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
        value: 1,
        label: '在职'
      }, {
        value: 0,
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
        gender: 'man',
        teacherStatus: 1,
        remark: ''
      },
      allClassOptions: [],
      defaultCheckedKeys: [],
      defaultExpandedKeys: [],
      defaultProps: {
        children: 'classList',
        label: function(data, node) {
          if (data.gradeName) {
            return data.gradeName
          } else {
            return data.className
          }
        }
      },
      rules: {
        teacherName: [
          { required: true, message: '请填写教师姓名', trigger: 'blur' }
        ],
        teacherType: [
          { required: true, message: '请选择教师职位', trigger: 'change' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.fetchData()
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
    handleCheckChange(data, checked, indeterminate) {
    },
    editTeacher(type, teacherId) {
      this.dialogFormVisible = true
      this.defaultCheckedKeys = []
      this.defaultExpandedKeys = []
      if (type === 'add') {
        this.title = '新增老师'
        this.form.gender = 'man'
        this.form.gender = 'man'
        this.form.teacherId = ''
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([])
          for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
            this.$refs.tree.store._getAllNodes()[i].expanded = false
          }
        }
      } else {
        this.title = '修改老师'
        this.getTeacherDetail(this.formInline.schoolId, teacherId)
      }
    },
    getTeacherDetail(schoolId, teacherId) {
      api.getTeacherDetail({ schoolId: schoolId, teacherId: teacherId }).then(response => {
        this.$refs.tree.setCheckedKeys([])
        if (response.code === 10000) {
          for (const key in this.form) {
            this.form[key] = response.data[key]
          }
          response.data.teacherClassList.forEach((value, key) => {
            this.defaultCheckedKeys.push(value.classId)
            this.defaultExpandedKeys.push(value.gradeId)
          })
          this.defaultExpandedKeys = Array.from(new Set(this.defaultExpandedKeys)) // 去重
        }
      })
    },
    getAllClassGroup(schoolId) {
      api.getAllClassGroup({ schoolId: schoolId }).then(response => {
        if (response.code === 10000) {
          this.allClassOptions = response.data ? response.data : []
        }
      })
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
        api.deleteTeacher({
          schoolId: this.formInline.schoolId,
          teacherId: teacherId
        }).then(response => {
          loading.close()
          if (response.code === 10000) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error(response.message)
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
            api.addTeacher({ ...this.form, ...{ schoolId: this.formInline.schoolId }, ...{ classIdList: this.$refs.tree.getCheckedKeys(true) }}).then(response => {
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
            api.editTeacher({ ...this.form, ...{ schoolId: this.formInline.schoolId }, ...{ classIdList: this.$refs.tree.getCheckedKeys(true) }}).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.dialogFormVisible = false
                this.fetchData()
                this.$message({
                  message: '修改成功！',
                  type: 'success'
                })
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
    cancel(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
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
