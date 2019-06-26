<template>
  <div class="detail-container">
    <el-row :gutter="50">
      <el-col :span="6"><span class="title">学校名称：</span>{{ schoolName }}</el-col>
      <el-col :span="6"><span class="title">学校账号：</span>{{ schoolAccount }}</el-col>
    </el-row>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'BookcaseDetail',
  data() {
    return {
      id: '',
      listLoading: true,
      list: null,
      schoolName: '涂卡绘本幼儿园',
      schoolAccount: 'tkbnfa'
    }
  },
  created() {
    this.id = this.$route.query.id
    this.getBookcaseDetail()
  },
  methods: {
    getBookcaseDetail(params) {
      this.listLoading = true
      api.getEquipmentBookcaseDetail(params).then(response => {
        this.list = response.items
        this.listLoading = false
      })
    }
  }
}
</script>

<style scoped>
.detail-container{
  margin: 20px;
}
.title{
  font-size: 16px;
  color: #67C23A;
}
</style>
