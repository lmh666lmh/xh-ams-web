<template>
  <div class="detail-container">
    <div class="header">
      <el-row :gutter="50">
        <el-col :span="6"><span class="title">当前学校：</span>{{ schoolName }}</el-col>
        <el-col :span="6"><span class="title">书柜编号：</span>{{ bookcaseNum }}</el-col>
        <el-button type="primary" size="mini" @click="back">返回</el-button>
      </el-row>
    </div>
    <div class="bookcase-status">
      <div class="section-title">
        书柜状态信息
        <div class="title-icon"/>
        <span class="clear-bookcase">清空柜内书籍</span>
      </div>
      <div class="bookcase-cont">
        <div class="bookcase-layer-list">
          <div class="list-item">
            <span class="bookcase-layer-num"><span>5层</span></span>
            <span class="bookcase-num">501</span>
            <span class="bookcase-num">502</span>
            <span class="bookcase-num">503</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">505</span>
            <span class="bookcase-num">506</span>
            <span class="bookcase-num">507</span>
            <span class="bookcase-num">508</span>
            <span class="bookcase-num">509</span>
            <span class="bookcase-num">510</span>
            <span class="bookcase-num">511</span>
            <span class="bookcase-num">512</span>
            <span class="bookcase-num">513</span>
            <span class="bookcase-num">514</span>
            <span class="bookcase-num">515</span>
            <span class="bookcase-num">516</span>
            <span class="bookcase-num">517</span>
          </div>
          <div class="list-item">
            <span class="bookcase-layer-num"><span>4层</span></span>
            <span class="bookcase-num">401</span>
            <span class="bookcase-num">402</span>
            <span class="bookcase-num">403</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">405</span>
            <span class="bookcase-num">406</span>
            <span class="bookcase-num">407</span>
            <span class="bookcase-num">408</span>
            <span class="bookcase-num">409</span>
            <span class="bookcase-num">410</span>
            <span class="bookcase-num">411</span>
            <span class="bookcase-num">412</span>
            <span class="bookcase-num">413</span>
            <span class="bookcase-num">414</span>
            <span class="bookcase-num">415</span>
            <span class="bookcase-num">416</span>
            <span class="bookcase-num">417</span>
            <span class="bookcase-num">418</span>
            <span class="bookcase-num">419</span>
            <span class="bookcase-num">420</span>
            <span class="bookcase-num">421</span>
            <span class="bookcase-num">422</span>
            <span class="bookcase-num">423</span>
            <span class="bookcase-num">424</span>
            <span class="bookcase-num">425</span>
          </div>
          <div class="list-item">
            <span class="bookcase-layer-num"><span>3层</span></span>
            <span class="bookcase-num">501</span>
            <span class="bookcase-num">502</span>
            <span class="bookcase-num">503</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
          </div>
          <div class="list-item">
            <span class="bookcase-layer-num"><span>2层</span></span>
            <span class="bookcase-num">401</span>
            <span class="bookcase-num">402</span>
            <span class="bookcase-num">403</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
            <span class="bookcase-num">404</span>
          </div>
          <div class="list-item">
            <span class="bookcase-layer-num"><span>1层</span></span>
            <span class="bookcase-num">501</span>
            <span class="bookcase-num">502</span>
            <span class="bookcase-num">503</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
            <span class="bookcase-num">504</span>
          </div>
        </div>
        <div class="bookcase-tips">
          <span><i class="normal"/>表示柜内有书</span>
          <span><i class="abnormal"/>表示柜内无书</span>
          <span><i class="no-books"/>表示异常（借阅异常、书籍报修、异常锁柜）</span>
        </div>
        <div class="bookcase-detail">
          <span>点击左边相应柜号<br>可查看该柜状态呢信息</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'BookcaseDetail',
  data() {
    return {
      bookcaseId: '',
      listLoading: true,
      list: null,
      schoolName: '幼儿园',
      bookcaseNum: 'CK2134543'
    }
  },
  created() {
    this.bookcaseId = this.$route.query.bookcaseId
  },
  methods: {
    back() {
      history.go(-1)
    },
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
    background-color: #ebeef4;
    padding: 20px;
  }
  .title{
    font-size: 16px;
    color: #7ccd4c;
  }
  .header{
    width: 100%;
    height: 50px;
    padding-left: 30px;
    line-height: 50px;
    border-radius: 5px;
    background-color: #fff;
  }
  .bookcase-status{
    width: 100%;
    border-radius: 5px;
    background-color: #fff;
    margin-top: 20px;
  }
  .section-title{
    width: 100%;
    padding: 15px 10px 10px 10px;
    position: relative;
    text-indent: 0.5rem;
  }
  .title-icon{
    width: 3px;
    height: 20px;
    background-color: orange;
    border-radius: 1.5px;
    position: absolute;
    top: 15px;
  }
  .clear-bookcase{
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #409EFF;
  }
  .bookcase-cont{
    width: 100%;
    position: relative;
    height: 420px;
    border-top: 1px solid #ccc;
  }
  .bookcase-cont .bookcase-layer-list{
    width: 100%;
    height: 350px;
    overflow: auto;
    padding-right: 450px;
    padding-left: 20px;
  }
  .bookcase-cont .bookcase-detail{
    position: absolute;
    width: 400px;
    height: 330px;
    border: 1px solid #ccc;
    border-radius: 5px;
    top: 20px;
    right: 30px;
  }
  .bookcase-cont .list-item{
    margin: 10px 0 20px 0;
    position: relative;
    padding-left: 50px;
  }
  .bookcase-cont .bookcase-layer-num{
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    width: 40px;
    height: 100%;
    background-color: #7ccd4c;
    border-radius: 5px;
    color: #fff;
    font-size: 14px;
  }
  .bookcase-cont .bookcase-layer-num>span{
    position: absolute;
    width: 40px;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
  }
  .bookcase-cont .bookcase-num{
    display: inline-block;
    width: 40px;
    height: 40px;
    background-color: #8fb1e1;
    border-radius: 5px;
    margin: 5px 5px 5px 0;
    color: #fff;
    text-align: center;
    line-height: 40px;
    font-size: 12px;
  }
  .bookcase-cont .bookcase-tips{
    margin: 10px 0 0 20px;
    width: 550px;
    height: 50px;
    line-height: 43px;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-sizing: border-box;
  }
  .bookcase-cont .bookcase-tips>span{
    position: relative;
    font-size: 12px;
    margin-left: 40px;
  }
  .bookcase-cont .bookcase-tips>span>i{
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    background-color: #fcd000;
    border-radius: 5px;
    top: 50%;
    left: -30px;
    transform: translateY(-50%);
  }
  .normal{
    background-color: #8fb1e1 !important;
  }
  .abnormal{
    background-color: red !important;
  }
  .no-books{
    background-color: #ccc !important;
  }
</style>
