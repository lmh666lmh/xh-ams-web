<template>
  <div class="customer-service-container">
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-circle-plus" @click="add">新增客服</el-button>
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
        <el-table-column label="客服姓名" align="center" prop="bookcaseNum"/>
        <el-table-column label="联系电话" align="center" prop="schoolName"/>
        <el-table-column label="微信号" align="center" prop="schoolName"/>
        <el-table-column label="已绑定学校" align="center" prop="schoolName"/>
        <el-table-column label="联系电话" align="center" prop="schoolName"/>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="edit">修改</el-button>
            <el-button type="text" size="small" @click="remove">删除</el-button>
            <el-button type="text" size="small">绑定学校</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <div class="tips">
      <p>注：1、如果未添加客服和绑定学校客服，默认联系的客服电话为代理商电话；</p>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" :title="dialogFormTitle" :width="dialogFormWidth">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="活动名称">
          <el-input v-model="form.name"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { api } from '@/api/index'

export default {
  name: 'CustomerService',
  components: {
    Pagination
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      formInline: {
        pageNum: 1,
        pageSize: 10
      },
      form: {
        name: ''
      },
      dialogFormTitle: '新增客服',
      dialogFormWidth: '600px',
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      api.getEquipmentBookcaseList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    add() {
      this.dialogFormVisible = true
    },
    edit() {
    },
    remove() {
    }
  }
}
</script>

<style scoped>
  .customer-service-container{
    margin: 20px;
  }
  .customer-service-container .operation-container{
    margin-bottom: 20px;
  }
  .customer-service-container .tips {
    color: #888;
    font-size: 12px;
    margin-top: 10px;
  }
  .customer-service-container .tips p{
    padding: 0;
    margin-top: 0;
  }
</style>
