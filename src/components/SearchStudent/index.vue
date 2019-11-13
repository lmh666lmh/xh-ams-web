<template>
  <div class="search-student">
    <el-form-item label="学生姓名">
      <el-autocomplete
        v-model="studentName"
        :fetch-suggestions="searchStudent"
        :debounce="700"
        :clearable="true"
        :trigger-on-focus="false"
        popper-class="my-autocomplete"
        placeholder="请填写"
        @select="searchStudentSelect">
        <i slot="suffix" class="el-icon-search el-input__icon"/>
        <template slot-scope="{ item }">
          <div class="name">{{ item.value }}</div>
          <span class="addr">所在学校：{{ item.schoolName }}</span>
        </template>
      </el-autocomplete>
    </el-form-item>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'SearchStudent',
  props: {
    studentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      studentName: ''
    }
  },
  watch: {
    studentName(newVal, oldVal) {
      if (newVal.trim() === '') {
        this.$emit('update:studentId', '')
      }
    }
  },
  methods: {
    searchStudent(queryString, callback) {
      this.$emit('update:studentId', '')
      const searchKey = queryString.trim()
      if (!searchKey) {
        callback([])
      } else {
        api.getSearchStudent({
          searchKey: searchKey
        }).then(res => {
          if (res.code === 10000) {
            const array = []
            res.data.forEach((value, index) => {
              array.push({
                value: value.studentName,
                studentId: value.studentId,
                schoolName: value.schoolName
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
    searchStudentSelect(item) {
      this.$emit('update:studentId', item.studentId)
    }
  }
}
</script>

<style scoped>
  .search-student{
    display: inline-block;
  }
</style>
