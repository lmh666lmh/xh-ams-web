<template>
  <div class="version-container">
    <div
      v-for="item in version"
      :key="item.num">
      <div style="margin-bottom: 10px;">
        <p style="margin: 0">{{ item.num }}</p>
        <p v-for="(cont, index) in item.cont" :key="index" style="margin: 0;text-indent: 1rem;font-size: 14px;">{{ cont }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Version',
  data() {
    return {
      version: [{
        num: 'V1.1.3',
        cont: ['1.邀请有礼（BrandBin-2019/11/04）']
      }, {
        num: 'V1.1.2',
        cont: ['1.学生导入优化（BrandBin-2019/10/24）']
      }, {
        num: 'V1.1.0',
        cont: ['1.新增教师管理（BrandBin-2019/10/15）']
      }, {
        num: 'V1.0.9',
        cont: ['1.试用优化（BrandBin-2019/09/26）']
      }, {
        num: 'V1.0.8',
        cont: ['1.书籍报修（BrandBin-2019/09/17）']
      }, {
        num: 'V1.0.7',
        cont: ['1.新增客服管理（BrandBin-2019/09/09）']
      }, {
        num: 'V1.0.6',
        cont: ['1.学校列表新增学校二维码（BrandBin-2019/09/02）']
      }, {
        num: 'V1.0.5',
        cont: [
          '1.新增付费管理功能菜单（BrandBin-2019/08/20）',
          '2.去除学校列表充值设置（BrandBin-2019/08/20）',
          '3.学校新建修改去除对接老师电话必填（BrandBin-2019/08/20）'
        ]
      }, {
        num: 'V1.0.4',
        cont: ['1.新增试用管理（BrandBin-2019/08/12）']
      }, {
        num: 'V1.0.3',
        cont: ['1.新增借阅异常功能（BrandBin-2019/08/06）']
      }, {
        num: 'V1.0.2',
        cont: ['1.借阅记录优化(搜索增加删除按钮，记录保存状态，柜号补0)（BrandBin-2019/07/26)']
      }, {
        num: 'V1.0.1',
        cont: ['1.新增借阅记录菜单（BrandBin-2019/07/26）']
      }, {
        num: 'V1.0.0',
        cont: ['1.基础版本（BrandBin）']
      }]
    }
  }
}
</script>

<style scoped>

</style>
