<template>
  <div class="search-book">
    <el-form-item label="书籍名称">
      <el-autocomplete
        v-model="bookName"
        :fetch-suggestions="searchBooks"
        :debounce="700"
        :clearable="true"
        :trigger-on-focus="false"
        popper-class="my-autocomplete"
        placeholder="请填写"
        @select="searchBooksSelect">
        <i slot="suffix" class="el-icon-search el-input__icon"/>
      </el-autocomplete>
    </el-form-item>
  </div>
</template>

<script>
import { api } from '@/api/index'

export default {
  name: 'SearchBook',
  props: {
    bookTemplateId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bookName: ''
    }
  },
  watch: {
    bookName(newVal, oldVal) {
      if (newVal.trim() === '') {
        this.$emit('update:bookTemplateId', '')
      }
    }
  },
  methods: {
    searchBooks(queryString, callback) {
      this.$emit('update:bookTemplateId', '')
      const searchKey = queryString.trim()
      if (!searchKey) {
        callback([])
      } else {
        api.getSearchBooks({
          searchKey: searchKey
        }).then(res => {
          if (res.code === 10000) {
            const array = []
            res.data.forEach((value, index) => {
              array.push({
                value: value.bookName,
                bookTemplateId: value.bookTemplateId
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
    searchBooksSelect(item) {
      this.$emit('update:bookTemplateId', item.bookTemplateId)
    }
  }
}
</script>

<style scoped>
  .search-book{
    display: inline-block;
  }
  .my-autocomplete li {
    line-height: normal;
    padding: 7px;
  }
  .my-autocomplete .name {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .my-autocomplete .addr {
    font-size: 12px;
    color: #b4b4b4;
    display: block;
    text-indent: 1rem;
  }
  .my-autocomplete .highlighted .addr {
    color: #ddd;
  }
</style>
