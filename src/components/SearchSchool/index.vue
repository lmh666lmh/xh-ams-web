<template>
  <div class="search-school">
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
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'SearchSchool',
  props: {
    schoolId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      schoolName: ''
    }
  },
  watch: {
    schoolName(newVal, oldVal) {
      if (newVal.trim() === '') {
        this.$emit('update:schoolId', '')
      }
    }
  },
  methods: {
    searchSchool(queryString, callback) {
      this.$emit('update:schoolId', '')
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
    searchSchoolSelect(item) {
      this.$emit('update:schoolId', item.schoolId)
    }
  }
}
</script>

<style scoped>
.search-school{
  display: inline-block;
}
</style>
