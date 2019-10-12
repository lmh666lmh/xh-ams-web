<template>
  <div class="school-manage">
    <el-row :gutter="20" style="margin-top: 10px;">
      <el-col :span="5"><span class="title">当前学校：</span>{{ schoolName }}</el-col>
      <el-button size="small" class="back" @click="back()">返回</el-button>
    </el-row>
    <el-tabs v-model="activeName" class="tab-container" @tab-click="handleClick">
      <el-tab-pane label="学生家长管理" name="third"><router-view v-if="activeName == 'third'"/></el-tab-pane>
      <el-tab-pane label="年级管理" name="first"><router-view v-if="activeName == 'first'"/></el-tab-pane>
      <el-tab-pane label="班级管理" name="second"><router-view v-if="activeName == 'second'"/></el-tab-pane>
      <el-tab-pane label="教师管理" name="fourth"><router-view v-if="activeName == 'fourth'"/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'Index',
  data() {
    return {
      schoolName: '',
      schoolId: '',
      activeName: 'third'
    }
  },
  created() {
    this.schoolId = this.$route.query.schoolId
    this.handleClick()
    this.getSchoolDetail()
  },
  methods: {
    handleClick(tab, event) {
      let path = '/schoolManage/index/studentParent'
      if (tab) {
        if (tab.name === 'first') {
          path = '/schoolManage/index/grade'
        } else if (tab.name === 'second') {
          path = '/schoolManage/index/class'
        } else if (tab.name === 'third') {
          path = '/schoolManage/index/studentParent'
        } else if (tab.name === 'fourth') {
          path = '/schoolManage/index/teacherManage'
        }
      }
      this.$router.push({
        path: path,
        query: {
          schoolId: this.schoolId
        }
      })
    },
    getSchoolDetail() {
      api.getSchoolDetail(this.schoolId).then(response => {
        if (response.code === 10000) {
          this.schoolName = response.data.schoolName
        }
      })
    },
    back() {
      this.$router.push({
        path: '/school/index'
      })
    }
  }
}
</script>

<style scoped>
.school-manage{
  margin: 20px;
}
.school-manage .back{
  margin-top: -5px;
}
.title{
  font-size: 16px;
  color: #67C23A;
}
.tab-container{
  margin-top: 20px;
}
</style>
