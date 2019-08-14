<template>
  <div class="grade-class-container">
    <el-form-item label="年级班级">
      <el-select v-model="gradeCode" placeholder="请选择年级" style="width: 150px;" @change="getClass">
        <el-option value="">请选择年级</el-option>
        <el-option
          v-for="item in gradeOptions"
          :key="item.gradeId"
          :label="item.gradeName"
          :value="item.gradeId" />
      </el-select>
      <el-select v-model="classCode" placeholder="请选择班级" style="width: 150px;" @change="changeClassId">
        <el-option value="">请选择班级</el-option>
        <el-option
          v-for="item in classOptions"
          :key="item.classId"
          :label="item.className"
          :value="item.classId" />
      </el-select>
    </el-form-item>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'GradeClass',
  props: {
    schoolId: {
      type: String,
      required: true,
      default: ''
    },
    gradeId: {
      type: String,
      default: null
    },
    classId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      gradeCode: '',
      classCode: '',
      gradeOptions: [],
      classOptions: []
    }
  },
  created() {
    this.getGradeAll()
    if (this.gradeId) {
      this.getClass()
    }
  },
  methods: {
    getGradeAll() {
      api.getAllGrade(this.schoolId).then(response => {
        if (response.code === 10000) {
          this.gradeOptions = response.data
        }
      })
    },
    getClass() {
      this.classOptions = []
      api.getAllClass({ gradeId: this.gradeCode }).then(response => {
        if (response.code === 10000) {
          this.classOptions = response.data
        }
      })
      this.$emit('update:gradeId', this.gradeCode)
      this.$emit('update:classId', '')
    },
    changeClassId() {
      this.$emit('update:classId', this.classCode)
    }
  }
}
</script>

<style scoped>
.grade-class-container {
  display: inline-block;
}
</style>
