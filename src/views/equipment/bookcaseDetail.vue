<template>
  <div class="bookcase-detail-container">
    <div class="header">
      <el-row :gutter="50">
        <el-col :span="6"><span class="title">当前学校：</span>{{ schoolName }}/{{ schoolAccount }}</el-col>
        <el-col :span="6"><span class="title">书柜编号：</span>{{ bookcaseNum }}</el-col>
        <el-button type="primary" size="mini" @click="back">返回</el-button>
      </el-row>
    </div>
    <div class="section">
      <div class="section-title">
        书柜状态信息
        <div class="title-icon"/>
        <!--<span class="clear-bookcase">清空柜内书籍</span>-->
      </div>
      <div class="bookcase-cont">
        <div class="bookcase-layer-list">
          <div v-for="(val, key) in bookcaseListData" :key="key" class="list-item">
            <span class="bookcase-layer-num"><span>{{ key }}层</span></span>
            <span v-for="(item, index) in val" :key="index" >
              <span v-if="item.hasError === 1" :class="currentGridId === item.gridId ? 'bookcase-num abnormal current': 'bookcase-num abnormal'" @click="getGridDetail({gridId: item.gridId, bookcaseId: item.bookcaseId, bookcaseRow: item.bookcaseRow, bookcaseColumn: item.bookcaseColumn})">{{ item.bookcaseRow }}{{ item.bookcaseColumn &lt; 10 ? '0' + item.bookcaseColumn : item.bookcaseColumn }}</span>
              <span v-else-if="item.hasBook === 1" :class="currentGridId === item.gridId ? 'bookcase-num current': 'bookcase-num'" @click="getGridDetail({gridId: item.gridId, bookcaseId: item.bookcaseId, bookcaseRow: item.bookcaseRow, bookcaseColumn: item.bookcaseColumn})">{{ item.bookcaseRow }}{{ item.bookcaseColumn &lt; 10 ? '0' + item.bookcaseColumn : item.bookcaseColumn }}</span>
              <span v-else-if="item.hasBook === 0" :class="currentGridId === item.gridId ? 'bookcase-num no-books current': 'bookcase-num no-books'" @click="getGridDetail({gridId: item.gridId, bookcaseId: item.bookcaseId, bookcaseRow: item.bookcaseRow, bookcaseColumn: item.bookcaseColumn})">{{ item.bookcaseRow }}{{ item.bookcaseColumn &lt; 10 ? '0' + item.bookcaseColumn : item.bookcaseColumn }}</span>
            </span>
          </div>
        </div>
        <div class="bookcase-tips">
          <span><i class="normal"/>表示柜内有书</span>
          <span><i class="no-books"/>表示柜内无书</span>
          <span><i class="abnormal"/>表示异常（借阅异常、书籍报修、异常锁柜）</span>
        </div>
        <div class="bookcase-detail">
          <div v-if="currentGridId === ''" class="default-text">点击左边相应柜号<br><br>可查看该柜状态呢信息</div>
          <div v-else-if="gridDetail" class="detail-text">
            <div class="detail-style">当前柜号：{{ gridDetail.bookcaseRow }}{{ gridDetail.bookcaseColumn &lt; 10 ? '0' + gridDetail.bookcaseColumn : gridDetail.bookcaseColumn }}</div>
            <div class="detail-style">格子状态：<span :class="[gridDetail.gridStatusStr === '正常' ? '' : 'red']">{{ gridDetail.gridStatusStr }}</span>
              <el-button v-if="gridDetail.hasError === 1" type="text" style="margin-left: 20px;padding: 0;" @click="routeTo('/anomalous/borrowingAnomalous')">点此查看</el-button>
            </div>
            <div class="detail-style">柜门状态：<span :class="[gridDetail.hasOpen === 0 ? '':'red']">{{ gridDetail.hasOpen === 0 ? '关门' : '开门' }}</span></div>
            <div v-if="gridDetail.inCabinetList.length !== 0" class="detail-style">柜内书籍：<span v-for="(item, index) in gridDetail.inCabinetList" :key="index">《{{ item.bookName }}》</span></div>
            <div v-else class="detail-style">柜内书籍：无书</div>
            <div v-if="gridDetail.repairBookList.length !== 0" class="detail-style">报修书籍：
              <span v-for="(item, index) in gridDetail.repairBookList" :key="index">《{{ item.bookName }}》</span>
              <el-button type="text" style="margin-left: 20px;padding: 0;" @click="routeTo('/anomalous/booksRepair')">点此查看</el-button>
            </div>
            <div class="operation-btn">
              <!--<el-button type="primary" size="mini" class="btn">远程开门</el-button>-->
              <el-button v-if="gridDetail.hasError === 0" type="success" size="mini" class="btn" @click="abnormalLockGrid">异常锁柜</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="15">
        <div class="section">
          <div class="section-title">
            书柜灯光设置
            <div class="title-icon"/>
          </div>
          <div class="lighting-cont">
            <el-row :gutter="20">
              <el-col :span="6">
                <div class="lighting">
                  <div class="demonstration">默认灯光颜色</div>
                  <el-color-picker v-model="defaultLighting" :predefine="predefineColors" class="color-picker" @change="setLightColor"/>
                </div>
              </el-col>
              <el-col :span="18">
                <div class="lighting">
                  <div>
                    <span class="title-label">是否定时开启紫色灯</span>
                    <el-switch
                      v-model="lightOpen"
                      active-color="#13ce66"
                      inactive-color="#dce0e9"
                      @click.native="switchLighting"
                      @change="lightingChange"/>
                  </div>
                  <div v-show="lightOpen">
                    <div class="time-picker">
                      <span class="title-label">开始时间</span>
                      <el-time-picker
                        v-model="lightBeginTimeTime"
                        format="HH:mm"
                        size="mini"
                        placeholder="选择时间"/>
                    </div>
                    <div class="time-picker">
                      <span class="title-label">结束时间</span>
                      <el-time-picker
                        v-model="lightEndTime"
                        format="HH:mm"
                        size="mini"
                        placeholder="选择时间"/>
                    </div>
                    <div>
                      <span class="title-label">重复时间</span>
                      <span :class="[isChecked1?'active':'']" class="week" @click="switchWeek(1)">一</span>
                      <span :class="[isChecked2?'active':'']" class="week" @click="switchWeek(2)">二</span>
                      <span :class="[isChecked3?'active':'']" class="week" @click="switchWeek(3)">三</span>
                      <span :class="[isChecked4?'active':'']" class="week" @click="switchWeek(4)">四</span>
                      <span :class="[isChecked5?'active':'']" class="week" @click="switchWeek(5)">五</span>
                      <span :class="[isChecked6?'active':'']" class="week" @click="switchWeek(6)">六</span>
                      <span :class="[isChecked7?'active':'']" class="week" @click="switchWeek(7)">日</span>
                      <el-button type="primary" size="mini" style="margin-left: 50px;" @click="setLightTime">设置</el-button>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="section">
          <div class="section-title">
            定时开关机
            <div class="title-icon"/>
          </div>
          <div class="switchgear-cont">
            <div>
              <span class="title-label">是否开启</span>
              <el-switch
                v-model="switchOpen"
                active-color="#13ce66"
                inactive-color="#dce0e9"
                @click.native="switchSwitchgear"
                @change="switchgearChange"/>
            </div>
            <div v-show="switchOpen">
              <div class="time-picker">
                <span class="title-label">开机时间</span>
                <el-time-picker
                  v-model="switchBeginTime"
                  format="HH:mm"
                  size="mini"
                  placeholder="选择时间"/>
              </div>
              <div class="time-picker">
                <span class="title-label">关机时间</span>
                <el-time-picker
                  v-model="switchEndTime"
                  format="HH:mm"
                  size="mini"
                  placeholder="选择时间"/>
              </div>
              <el-button type="primary" size="mini" class="btn" @click="setSwitchTime">设置</el-button>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <!--<el-row :gutter="20">
      <el-col :span="15">
        <div class="section">
          <div class="section-title">
            天线强度设置
            <div class="title-icon"/>
            <span class="edit-antenna">修改</span>
            <span class="default-antenna">恢复默认</span>
          </div>
          <div class="lighting-cont">
            <el-form ref="antennaForm" :model="antennaForm" :disabled="antennaDisabled" label-width="100px">
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="刷书强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
              <el-form-item label="51强度：" class="antenna-item">
                <el-input v-model="antennaForm.name" size="mini" class="antenna-input"/>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="section">
          <div class="section-title">
            获取书柜日志
            <div class="title-icon"/>
            <span class="get-log">获取日志</span>
          </div>
          <div class="switchgear-cont">
            <div class="log-cont">
              <el-table
                :data="tableData"
                :cell-style="cellStyle"
                :show-header="false"
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="日期"
                  width="180"/>
                <el-table-column label="下载" align="right">
                  <template slot-scope="scope">
                    <el-button type="text" size="small">点击下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>-->
    <!--<div class="section">
      <div class="section-title">
        单个柜门天线/开门检测
        <div class="title-icon"/>
      </div>
      <div class="antenna-cont">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="testing-antenna">
              <div style="margin: 20px 0 0 20px;">输入要检测的柜号</div>
              <el-input v-model="bookcaseNum" placeholder="请输入柜号" class="testing-input"/>
              <div class="testing-cont">
                <el-button type="success" size="mini" style="width: 104px;">开门检测</el-button>
                <span class="testing-label">检测结果：</span>
              </div>
              <div class="testing-cont" style="top: 70px;">
                <el-button type="success" size="mini">获取开锁状态</el-button>
                <span class="testing-label">检测结果：</span>
              </div>
              <div class="testing-cont" style="top: 120px;">
                <el-button type="success" size="mini">获取关锁状态</el-button>
                <span class="testing-label">检测结果：</span>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="testing-log">
              <el-table
                :data="tableData"
                :cell-style="cellStyle"
                fit
                style="width: 100%">
                <el-table-column
                  prop="date"
                  label="检测柜号"/>
                <el-table-column
                  prop="name"
                  label="检测方式"/>
                <el-table-column
                  prop="address"
                  label="检测时间"/>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>-->
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'BookcaseDetail',
  data() {
    return {
      bookcaseId: '',
      schoolName: '',
      schoolAccount: '',
      bookcaseNum: '',
      isOnline: false,
      defaultLighting: '#fff',
      lightOpen: false,
      switchOpen: false,
      lightBeginTimeTime: new Date(),
      lightEndTime: new Date(),
      switchBeginTime: new Date(),
      switchEndTime: new Date(),
      isChecked1: false,
      isChecked2: false,
      isChecked3: false,
      isChecked4: false,
      isChecked5: false,
      isChecked6: false,
      isChecked7: false,
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585'
      ],
      // antennaForm: {
      //   name: ''
      // },
      // antennaDisabled: true,
      // tableData: [{
      //   date: '2016-05-02',
      //   name: '王小虎',
      //   address: '上海市普陀区金沙江路 1518 弄'
      // }],
      bookcaseListData: null,
      currentGridId: '',
      gridDetail: null
    }
  },
  created() {
    this.bookcaseId = this.$route.query.bookcaseId
    this.schoolName = this.$route.query.schoolName
    this.schoolAccount = this.$route.query.schoolAccount
    this.bookcaseNum = this.$route.query.bookcaseNum
    this.isOnline = this.$route.query.isOnline
    this.getEquipmentBookcaseGridList()
    this.getBookcaseExtendInfo()
  },
  methods: {
    back() {
      history.go(-1)
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding: 5px 0'
    },
    getEquipmentBookcaseGridList() {
      api.getEquipmentBookcaseGridList({
        bookcaseId: this.bookcaseId
      }).then(res => {
        if (res.code === 10000) {
          this.bookcaseListData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getBookcaseExtendInfo() {
      api.getBookcaseExtendInfo({
        bookcaseId: this.bookcaseId
      }).then(res => {
        if (res.code === 10000) {
          const switchTime = JSON.parse(res.data.switchOnOffTime)
          const lightTime = JSON.parse(res.data.lightOnOffTime)
          const time = '2019-01-01 ' // 无用，只是为了保持时间的正确性
          this.defaultLighting = '#' + res.data.lightColor.slice(3)
          this.lightOpen = !!res.data.lightOpen
          this.switchOpen = !!res.data.switchOpen
          this.lightBeginTimeTime = new Date(time + lightTime.beginTime)
          this.lightEndTime = new Date(time + lightTime.endTime)
          this.switchBeginTime = new Date(time + switchTime.beginTime)
          this.switchEndTime = new Date(time + switchTime.endTime)
          lightTime.repeatTime.forEach((value, index) => {
            switch (value) {
              case 'Monday':
                this.isChecked1 = true
                break
              case 'Tuesday':
                this.isChecked2 = true
                break
              case 'Wednesday':
                this.isChecked3 = true
                break
              case 'Thursday':
                this.isChecked4 = true
                break
              case 'Friday':
                this.isChecked5 = true
                break
              case 'Saturday':
                this.isChecked6 = true
                break
              case 'Sunday':
                this.isChecked7 = true
                break
            }
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getGridDetail(object) {
      this.currentGridId = object.gridId
      api.getGridDetail({
        bookcaseId: object.bookcaseId,
        bookcaseRow: object.bookcaseRow,
        bookcaseColumn: object.bookcaseColumn
      }).then(res => {
        if (res.code === 10000) {
          this.gridDetail = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    abnormalLockGrid() {
      api.setBookcaseLockGrid({
        bookcaseId: this.gridDetail.bookcaseId,
        bookcaseRow: this.gridDetail.bookcaseRow,
        bookcaseColumn: this.gridDetail.bookcaseColumn,
        hasError: 1
      }).then(res => {
        if (res.code === 10000) {
          this.getEquipmentBookcaseGridList()
          this.$message({
            message: '锁柜成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 保持未点击确认之前的状态
    lightingChange() {
      if (this.lightOpen) {
        this.lightOpen = false
      } else {
        this.lightOpen = true
      }
    },
    switchLighting() {
      let str = ''
      if (this.lightOpen) {
        str = '您是否要关闭定时开启紫色灯？'
      } else {
        str = '您是否要开启定时开启紫色灯？'
      }
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.setBookcaseLightColor({
          bookcaseId: this.bookcaseId,
          lightSettingType: 2,
          lightOpen: this.lightOpen ? 0 : 1,
          lightOnOffTime: JSON.stringify({
            beginTime: this.formatDateTime(this.lightBeginTimeTime),
            endTime: this.formatDateTime(this.lightEndTime),
            repeatTime: this.repeatWeekTime()
          })
        }).then(res => {
          if (res.code === 10000) {
            this.lightOpen = !this.lightOpen
            this.$message({
              message: '定时开启紫色灯设置成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        console.log('取消了')
      })
    },
    setLightTime() {
      api.setBookcaseLightColor({
        bookcaseId: this.bookcaseId,
        lightSettingType: 2,
        lightOpen: 1,
        lightOnOffTime: JSON.stringify({
          beginTime: this.formatDateTime(this.lightBeginTimeTime),
          endTime: this.formatDateTime(this.lightEndTime),
          repeatTime: this.repeatWeekTime()
        })
      }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '定时开启紫色灯时间设置成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    repeatWeekTime() {
      const repeatTime = []
      if (this.isChecked1) {
        repeatTime.push('Monday')
      }
      if (this.isChecked2) {
        repeatTime.push('Tuesday')
      }
      if (this.isChecked3) {
        repeatTime.push('Wednesday')
      }
      if (this.isChecked4) {
        repeatTime.push('Thursday')
      }
      if (this.isChecked5) {
        repeatTime.push('Friday')
      }
      if (this.isChecked6) {
        repeatTime.push('Saturday')
      }
      if (this.isChecked7) {
        repeatTime.push('Sunday')
      }
      return repeatTime
    },
    setLightColor() {
      api.setBookcaseLightColor({
        bookcaseId: this.bookcaseId,
        lightSettingType: 1,
        lightColor: '#00' + this.defaultLighting.split('#')[1]
      }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '灯光颜色设置成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    switchSwitchgear() {
      if (this.switchOpen) {
        this.switchOpen = false
      } else {
        this.switchOpen = true
      }
    },
    switchgearChange() {
      let str = ''
      if (!this.switchOpen) { // 插件此时已经更改此值
        str = '您是否要关闭定时开关机？'
      } else {
        str = '您是否要开启定时开关机？'
      }
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.setBookcaseSwitchgear({
          bookcaseId: this.bookcaseId,
          switchSettingType: 1,
          switchOpen: this.switchOpen ? 0 : 1,
          switchOnOffTime: JSON.stringify({
            beginTime: this.formatDateTime(this.switchBeginTime),
            endTime: this.formatDateTime(this.switchEndTime)
          })
        }).then(res => {
          if (res.code === 10000) {
            this.switchOpen = !this.switchOpen
            this.$message({
              message: '定时开关机设置成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        console.log('取消了')
      })
    },
    setSwitchTime() {
      api.setBookcaseSwitchgear({
        bookcaseId: this.bookcaseId,
        switchSettingType: 1,
        switchOpen: 1,
        switchOnOffTime: JSON.stringify({
          beginTime: this.formatDateTime(this.switchBeginTime),
          endTime: this.formatDateTime(this.switchEndTime)
        })
      }).then(res => {
        if (res.code === 10000) {
          this.$message({
            message: '开关机时间设置成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * @method: formatDateTime
     * @description: 时间转换
     * @author: ProudBin
     * @update: 2019-11-05
     * @param {Object} new Date
     * @return{Object} HH:MM
     */
    formatDateTime(date) {
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      return h + ':' + minute
    },
    switchWeek(num) {
      switch (num) {
        case 1:
          this.isChecked1 = !this.isChecked1
          break
        case 2:
          this.isChecked2 = !this.isChecked2
          break
        case 3:
          this.isChecked3 = !this.isChecked3
          break
        case 4:
          this.isChecked4 = !this.isChecked4
          break
        case 5:
          this.isChecked5 = !this.isChecked5
          break
        case 6:
          this.isChecked6 = !this.isChecked6
          break
        case 7:
          this.isChecked7 = !this.isChecked7
          break
      }
    },
    routeTo(path) {
      this.$router.push({
        path: path
      })
    }
  }
}
</script>

<style scoped>
  .bookcase-detail-container{
    background-color: #ebeef4;
    padding: 10px;
  }
  .red{
    color: red !important;
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
  .section{
    width: 100%;
    border-radius: 5px;
    background-color: #fff;
    margin-top: 10px;
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
    border-top: 1px solid #ebeef4;
  }
  .bookcase-cont .bookcase-layer-list{
    width: 100%;
    height: 340px;
    margin-top: 10px;
    overflow: auto;
    padding-right: 450px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .bookcase-cont .bookcase-detail{
    position: absolute;
    width: 400px;
    height: 330px;
    border: 1px solid #ebeef4;
    border-radius: 5px;
    top: 20px;
    right: 30px;
    box-sizing: border-box;
    padding: 20px;
  }
  .bookcase-cont .bookcase-detail .default-text{
    text-align: center;
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  .bookcase-cont .bookcase-detail .detail-style{
    margin: 20px 0;
    box-sizing: border-box;
    padding-left: 20px;
  }
  .bookcase-cont .bookcase-detail .operation-btn{
    position: absolute;
    width: 100%;
    bottom: 25px;
    left: 0;
    text-align: center;
  }
  .bookcase-cont .bookcase-detail .operation-btn .btn{
    margin: 0 30px !important;
  }
  .bookcase-cont .bookcase-detail .detail-text{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
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
    cursor: pointer;
    box-sizing: border-box;
    border: 2px solid transparent;
  }
  .bookcase-cont .bookcase-tips{
    margin: 10px 0 0 20px;
    width: 550px;
    height: 50px;
    line-height: 43px;
    border: 1px solid #ebeef4;
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
    background-color: #ebeef4 !important;
  }
  .lighting-cont{
    position: relative;
    border-top: 1px solid #ebeef4;
    padding: 20px;
    height: 220px;
  }
  .lighting{
    height: 180px;
    border: 1px solid #ebeef4;
    border-radius: 5px;
    padding: 20px;
    box-sizing: border-box;
  }
  .demonstration{
    text-align: center;
    margin: 20px;
  }
  .color-picker{
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .switchgear-cont{
    position: relative;
    border-top: 1px solid #ebeef4;
    padding: 20px;
    height: 220px;
  }
  .antenna-cont{
    position: relative;
    border-top: 1px solid #ebeef4;
    padding: 20px;
    height: 220px;
  }
  .time-picker{
    margin: 10px 0;
  }
  .title-label{
    margin-right: 10px;
  }
  .week{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #ebeef4;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    text-align: center;
    line-height: 20px;
  }
  .week.active{
    background-color: #7ccd4c;
  }
  .edit-antenna{
    position: absolute;
    right: 87px;
    top: 50%;
    transform: translateY(-50%);
    color: #409EFF;
    font-size: 14px;
    padding-right: 10px;
    border-right: 1px solid #409EFF;
  }
  .default-antenna{
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #c1c1c1;
    font-size: 14px;
  }
  .antenna-item{
    margin: 0;
    float: left;
    width: 30%;
  }
  .antenna-input{
    width: 100px;
  }
  .log-cont{
    margin-top: -13px;
    max-height: 200px;
    overflow: auto;
  }
  .get-log{
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: #409EFF;
    font-size: 14px;
  }
  .testing-antenna{
    height: 180px;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #ebeef4;
    border-radius: 5px;
  }
  .testing-log{
    max-height: 180px;
    overflow: auto;
    border: 1px solid #ebeef4;
    border-radius: 5px;
  }
  .testing-input{
    display: block;
    width: 100px;
    position: relative;
    top: 20px;
    left: 30px;
  }
  .testing-cont{
    position: absolute;
    top: 20px;
    left: 300px;
  }
  .testing-cont .testing-label{
    display: inline-block;
    font-size: 14px;
    margin-left: 20px;
  }
  .current{
    border: 2px solid #266bde !important;
  }
</style>
