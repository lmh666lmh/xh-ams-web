<template>
  <div class="statistics-container">
    <!--<div class="statistics-list">
      <el-button type="success" class="statistics-button">学校统计</el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/school')">
        <span>{{ schoolTotal }}</span>
        <p class="statistics-name">学校总数量</p>
      </el-button>
    </div>
    <div class="statistics-list">
      <el-button type="success" class="statistics-button">书柜统计</el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/equipment/bookcaseManage')">
        <span>{{ bookcaseTotal }}</span>
        <p class="statistics-name">入库总数量</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/equipment/bookcaseManage?bookcaseStatus=1')">
        <span>{{ bookcaseBind }}</span>
        <p class="statistics-name">已绑定</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/equipment/bookcaseManage?bookcaseStatus=0')">
        <span>{{ bookcaseUnBind }}</span>
        <p class="statistics-name">未绑定</p>
      </el-button>
    </div>
    <div class="statistics-list">
      <el-button type="success" class="statistics-button">借阅卡统计</el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/equipment/borrowCardManage')">
        <span>{{ lendingCardTotal }}</span>
        <p class="statistics-name">入库总数量</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/equipment/borrowCardManage?cardStatus=1')">
        <span>{{ lendingCardBind }}</span>
        <p class="statistics-name">已绑定</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/equipment/borrowCardManage?cardStatus=0')">
        <span>{{ lendingCardUnBind }}</span>
        <p class="statistics-name">未绑定</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/equipment/borrowCardManage?cardStatus=2')">
        <span>{{ lendingCardLose }}</span>
        <p class="statistics-name">挂失</p>
      </el-button>
    </div>
    <div class="statistics-list">
      <el-button type="success" class="statistics-button">书籍状态统计</el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/books/booksStatus')">
        <span>{{ booksStatusIn }}</span>
        <p class="statistics-name">在柜</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/books/booksStatus')">
        <span>{{ booksStatusBorrowing }}</span>
        <p class="statistics-name">借阅</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/books/booksStatus')">
        <span>{{ booksStatusBuy }}</span>
        <p class="statistics-name">购买</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/books/booksStatus')">
        <span>{{ booksStatusLose }}</span>
        <p class="statistics-name">丢失</p>
      </el-button>
      <el-button type="text" class="statistics-item" @click="routeTo('/books/booksStatus')">
        <span>{{ booksStatusRecovery }}</span>
        <p class="statistics-name">回收</p>
      </el-button>
    </div>-->
    <p>暂无内容，敬请期待</p>
  </div>
</template>

<script>
// import { api } from '@/api/index'

export default {
  name: 'Index',
  data() {
    return {
      listLoading: true,
      schoolTotal: 6,
      bookcaseTotal: 6,
      bookcaseBind: 4,
      bookcaseUnBind: 2,
      lendingCardTotal: 6,
      lendingCardBind: 3,
      lendingCardUnBind: 2,
      lendingCardLose: 1,
      booksStatusIn: 80,
      booksStatusBorrowing: 90,
      booksStatusBuy: 20,
      booksStatusLose: 10,
      booksStatusRecovery: 10

    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData(params) {
      // this.listLoading = true
      // api.getIndexStatistics(params).then(response => {
      //   this.listLoading = false
      // }).catch(() => {
      //   this.listLoading = false
      // })
    },
    routeTo(path) {
      this.$router.push({
        path: path,
        query: {
          id: arguments[1]
        }
      })
    }
  }
}
</script>

<style scoped>
p{
  margin: 0;
}
.statistics-container{
  margin: 20px;
}
.statistics-list{
  margin-bottom: 50px;
}
.statistics-item{
  width: 80px;
  margin-right: 30px;
  position: relative;
  top: -8px;
}
.statistics-button{
  width: 150px;
  margin-right: 20px;
}
.statistics-name{
  color: #333;
  margin-top: 5px;
}
</style>
