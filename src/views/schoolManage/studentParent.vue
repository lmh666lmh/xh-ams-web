<template>
  <div class="student-container">
    <div class="search-container">
      <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
        <el-form-item label="年级班级">
          <el-select v-model="formInline.gradeId" placeholder="请选择年级" style="width: 150px;" @change="getClass('search', formInline.gradeId)">
            <el-option value="">请选择年级</el-option>
            <el-option
              v-for="item in gradeOptions"
              :key="item.gradeId"
              :label="item.gradeName"
              :value="item.gradeId" />
          </el-select>
          <el-select v-model="formInline.classId" placeholder="请选择班级" style="width: 150px;">
            <el-option value="">请选择班级</el-option>
            <el-option
              v-for="item in classOptions"
              :key="item.classId"
              :label="item.className"
              :value="item.classId" />
          </el-select>
        </el-form-item>
        <el-form-item label="学生姓名">
          <el-input v-model="formInline.studentName" placeholder="请填写学生姓名"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="success" size="small" class="el-icon-circle-plus" @click="editStudent('add')">新增学生</el-button>
      <el-upload
        :on-success="onSuccess"
        :on-error="onError"
        :on-progress="startUpload"
        :show-file-list="false"
        :action="uploadUrl"
        :headers="headers"
        name="uploadExcel"
        accept=".xlsx,.xls"
        class="upload-demo">
        <el-button size="small" type="success" class="el-icon-upload">批量导入学生</el-button>
      </el-upload>
      <el-button type="success" size="small" class="el-icon-download" @click="down('/excelTemplate/导入学生家长模板.xlsx')">模版下载</el-button>
    </div>
    <div class="list">
      <el-table
        v-loading="listLoading"
        :data="list"
        :cell-style="cellStyle"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        :default-expand-all="false"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
        @current-change="currentChange"
        @expand-change="expandParent">
        <el-table-column align="center" label="序号" width="95px">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" prop="studentName"/>
        <el-table-column label="年级" align="center" prop="gradeName"/>
        <el-table-column label="班级" align="center" prop="className"/>
        <el-table-column label="有效期" align="center" prop="expireTime"/>
        <el-table-column label="点击下方箭头查看家长信息" type="expand" width="110">
          <template slot-scope="scope">
            <el-table
              v-loading="scope.row.loading"
              :data="scope.row.children"
              :cell-style="cellStyle"
              :header-cell-style="headerCellStyle"
              element-loading-text="Loading"
              size="mini"
              border
              fit
              highlight-current-row>
              <el-table-column label="关系" width="95" align="center" prop="familyRelationName"/>
              <el-table-column label="家长姓名" align="center" prop="parentName"/>
              <el-table-column label="手机号码" align="center" prop="parentAccount"/>
              <el-table-column label="借阅卡号" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.cardNum != 0">{{ scope.row.cardNum }}</span>
                </template>
              </el-table-column>
              <!--<el-table-column label="激活状态" align="center">-->
              <!--<template slot-scope="scope">-->
              <!--<span v-if="scope.row.activated == 0">未激活</span>-->
              <!--<span v-else>激活</span>-->
              <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column label="来源" align="center" prop="createSourceStr"/>
              <el-table-column label="操作" align="center" width="160px">
                <template slot-scope="scopeChild">
                  <el-button type="text" size="small" @click="editParent('edit', scopeChild.row.studentId, scopeChild.row.parentId)" >修改</el-button>
                  <el-button type="text" size="small" @click="deleteParent(scopeChild.row.studentId, scopeChild.row.parentId,scope.$index)" >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editStudent('edit', scope.row.studentId)" >修改</el-button>
            <el-button type="text" size="small" @click="deleteStudent(scope.row.studentId)" >删除</el-button>
            <el-button type="text" size="small" @click="editParent('add', scope.row.studentId)" >添加家长</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="total != 0"><Pagination :total="total" :page.sync="formInline.pageNum" :limit.sync="formInline.pageSize" @pagination="fetchData"/></div>
    <el-dialog :visible.sync="dialogForm.addStudentDialogVisible" :width="dialogForm.formWidth" :close-on-click-modal="false" custom-class="addStudentDialog" title="新增学生" @close="closeDialog('addStudent')">
      <div class="dialog-body">
        <el-form ref="addStudentForm" :model="dialogForm.form" :rules="dialogForm.rules" size="small">
          <div class="title">学生信息</div>
          <el-form-item :label-width="dialogForm.formLabelWidth" label="学生姓名" prop="studentName">
            <el-input v-model="dialogForm.form.studentName" style="width: 200px;" maxlength="32"/>
          </el-form-item>
          <el-form-item :label-width="dialogForm.formLabelWidth" label="出生日期" prop="birthday">
            <el-date-picker
              v-model="dialogForm.form.birthday"
              :picker-options="pickerOptions"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              style="width: 200px;"/>
          </el-form-item>
          <el-form-item :label-width="dialogForm.formLabelWidth" label="性别">
            <el-radio v-model="dialogForm.form.gender" label="man">男</el-radio>
            <el-radio v-model="dialogForm.form.gender" label="woman">女</el-radio>
          </el-form-item>
          <el-form-item :label-width="dialogForm.formLabelWidth" label="所在班级" required>
            <el-col :span="10">
              <el-form-item prop="gradeId">
                <el-select v-model="dialogForm.form.gradeId" style="width: 200px;" @change="getClass('dialog', dialogForm.form.gradeId)">
                  <el-option value="">请选择年级</el-option>
                  <el-option
                    v-for="item in gradeOptions"
                    :key="item.gradeId"
                    :label="item.gradeName"
                    :value="item.gradeId" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="classId">
                <el-select v-model="dialogForm.form.classId" style="width: 200px;">
                  <el-option value="">请选择班级</el-option>
                  <el-option
                    v-for="item in classDialogOptions"
                    :key="item.classId"
                    :label="item.className"
                    :value="item.classId" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
          <div class="title">家长信息<span style="font-size: 12px;font-weight: 400;">（请至少填写一个家长信息）</span></div>
          <el-form-item
            v-for="(item, index) in dialogForm.form.parent"
            :key="index">
            <el-row :gutter="5">
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.familyRelationCode'" :rules="dialogForm.rules.familyRelationCode">
                  <el-select v-model="item.familyRelationCode" placeholder="请选择关系">
                    <el-option value="">请选择关系</el-option>
                    <el-option
                      v-for="item in relationOptions"
                      :key="item.subCode"
                      :label="item.subName"
                      :value="item.subCode" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.parentName'" :rules="dialogForm.rules.parentName">
                  <el-input v-model="item.parentName" maxlength="32" placeholder="请填写姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.parentAccount'" :rules="dialogForm.rules.parentAccount">
                  <el-input v-model="item.parentAccount" maxlength="11" placeholder="请填写手机号"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="item.cardNum" maxlength="32" placeholder="借阅卡号"/>
                </el-form-item>
              </el-col>
              <el-col v-if="dialogForm.form.parent.length - 1 == index" :span="1.5">
                <el-button icon="el-icon-plus" circle @click="addParentDialog('student')"/>
              </el-col>
              <el-col v-if="dialogForm.form.parent.length > 1" :span="1.5">
                <el-button icon="el-icon-minus" circle @click="removeParentDialog('student', item)"/>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('addStudent')">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm('addStudent', 'addStudentForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogForm.editStudentDialogVisible" :width="dialogForm.formWidth" :close-on-click-modal="false" custom-class="addStudentDialog" title="修改学生" @close="closeDialog('editStudent')">
      <el-form ref="editStudentForm" :model="dialogForm.form" :rules="dialogForm.rules" size="small">
        <el-form-item :label-width="dialogForm.formLabelWidth" label="学生姓名" prop="studentName">
          <el-input v-model="dialogForm.form.studentName" style="width: 200px;" maxlength="32"/>
        </el-form-item>
        <el-form-item :label-width="dialogForm.formLabelWidth" label="出生日期" prop="birthday">
          <el-date-picker
            v-model="dialogForm.form.birthday"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            style="width: 200px;"/>
        </el-form-item>
        <el-form-item :label-width="dialogForm.formLabelWidth" label="性别">
          <el-radio v-model="dialogForm.form.gender" label="man">男</el-radio>
          <el-radio v-model="dialogForm.form.gender" label="woman">女</el-radio>
        </el-form-item>
        <el-form-item :label-width="dialogForm.formLabelWidth" label="所在班级" required>
          <el-col :span="10">
            <el-form-item prop="gradeId">
              <el-select v-model="dialogForm.form.gradeId" style="width: 200px;" @change="getClass('dialog', dialogForm.form.gradeId)">
                <el-option value="">请选择年级</el-option>
                <el-option
                  v-for="item in gradeOptions"
                  :key="item.gradeId"
                  :label="item.gradeName"
                  :value="item.gradeId" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item prop="classId">
              <el-select v-model="dialogForm.form.classId" style="width: 200px;">
                <el-option value="">请选择班级</el-option>
                <el-option
                  v-for="item in classDialogOptions"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('editStudent')">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm('editStudent', 'editStudentForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogForm.addParentDialogVisible" :width="dialogForm.formWidth" :close-on-click-modal="false" custom-class="addStudentDialog" title="新增家长" @close="closeDialog('addParent')">
      <div style="max-height: 300px;overflow-y: auto;overflow-x: hidden;">
        <el-form ref="addParentForm" :model="dialogForm.form" :rules="dialogForm.rules" size="small">
          <el-form-item
            v-for="(item, index) in dialogForm.form.parent"
            :key="index">
            <el-row :gutter="5">
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.familyRelationCode'" :rules="dialogForm.rules.familyRelationCode">
                  <el-select v-model="item.familyRelationCode" placeholder="请选择关系">
                    <el-option value="">请选择关系</el-option>
                    <el-option
                      v-for="item in relationOptions"
                      :key="item.subCode"
                      :label="item.subName"
                      :value="item.subCode" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.parentName'" :rules="dialogForm.rules.parentName">
                  <el-input v-model="item.parentName" maxlength="32" placeholder="请填写姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.parentAccount'" :rules="dialogForm.rules.parentAccount">
                  <el-input v-model="item.parentAccount" maxlength="11" placeholder="请填写手机号"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="item.cardNum" maxlength="32" placeholder="借阅卡号"/>
                </el-form-item>
              </el-col>
              <el-col v-if="dialogForm.form.parent.length - 1 == index" :span="1.5">
                <el-button icon="el-icon-plus" circle @click="addParentDialog('parent')"/>
              </el-col>
              <el-col v-if="dialogForm.form.parent.length > 1" :span="1.5">
                <el-button icon="el-icon-minus" circle @click="removeParentDialog('parent', item)"/>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('addParent')">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm('addParent', 'addParentForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogForm.editParentDialogVisible" :width="dialogForm.formWidth" :close-on-click-modal="false" custom-class="addStudentDialog" title="修改家长" @close="closeDialog('editParent')">
      <div style="max-height: 300px;overflow-y: auto;overflow-x: hidden;">
        <el-form ref="editParentForm" :model="dialogForm.form" :rules="dialogForm.rules" size="small">
          <el-form-item
            v-for="(item, index) in dialogForm.form.parent"
            :key="index">
            <el-row :gutter="5">
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.familyRelationCode'" :rules="dialogForm.rules.familyRelationCode">
                  <el-select v-model="item.familyRelationCode" placeholder="请选择关系">
                    <el-option value="">请选择关系</el-option>
                    <el-option
                      v-for="item in relationOptions"
                      :key="item.subCode"
                      :label="item.subName"
                      :value="item.subCode" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.parentName'" :rules="dialogForm.rules.parentName">
                  <el-input v-model="item.parentName" maxlength="32" placeholder="请填写姓名"/>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item :prop="'parent.' + index + '.parentAccount'" :rules="dialogForm.rules.parentAccount">
                  <el-input v-model="item.parentAccount" maxlength="11" placeholder="请填写手机号"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-input v-model="item.cardNum" maxlength="32" placeholder="借阅卡号"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel('editParent')">取 消</el-button>
        <el-button size="small" type="primary" @click="confirm('editParent', 'editParentForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="confirmAddStudentDialog" :close-on-click-modal="false" width="800px" custom-class="confirmStudentDialog" title="当前新增存在重名的学生">
      <div style="max-height: 300px;overflow-y: auto;overflow-x: hidden;">
        <el-table
          v-loading="confirmAddStudentDataLoading"
          :data="confirmAddStudentData ? confirmAddStudentData.list : confirmAddStudentData"
          :cell-style="cellStyle"
          element-loading-text="Loading"
          border
          fit>
          <el-table-column align="center" label="序号" width="55px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="学生姓名" align="center" prop="studentName"/>
          <el-table-column label="家长姓名" align="center" prop="gradeName">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.parentInfoList"
                :show-header="false"
                :cell-style="repeatStyle"
                :header-cell-style="headerStyle">
                <el-table-column
                  align="center"
                  label="家长姓名">
                  <template slot-scope="innerScope">
                    <span :class="innerScope.row.repeatFlag ? 'red': ''">{{ innerScope.row.accountName }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" align="center" prop="className">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.parentInfoList"
                :show-header="false"
                :cell-style="repeatStyle"
                :header-cell-style="headerStyle">
                <el-table-column
                  align="center"
                  label="手机号码">
                  <template slot-scope="innerScope">
                    <span :class="innerScope.row.repeatFlag ? 'red': ''">{{ innerScope.row.accountNum }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="家长信息" align="center">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.parentInfoList"
                :show-header="false"
                :cell-style="repeatStyle"
                :header-cell-style="headerStyle">
                <el-table-column
                  align="center"
                  label="关系">
                  <template slot-scope="innerScope">
                    <span :class="innerScope.row.repeatFlag ? 'red': ''">{{ innerScope.row.familyRelationName }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.canJoin" type="text" size="small" @click="joinFamily(scope.row.studentId)" >加入成员</el-button>
              <el-button v-else type="text" size="small" disabled>加入成员</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="confirmAddStudentData && confirmAddStudentData.addStudent" size="small" @click="goOnAddStudent">新增学生</el-button>
        <el-button v-else size="small" disabled>新增学生</el-button>
        <el-button size="small" type="success" @click="cancel('confirmAddStudent')">取消新增</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="repeatStudentDialog" :width="dialogForm.formWidth" :close-on-click-modal="false" custom-class="confirmStudentDialog" title="当前批量导入存在重复的学生" >
      <div style="margin-bottom: 15px;color: #7ccd4c;">重复学生名单（已过滤）：</div>
      <div style="max-height: 300px;overflow-y: auto;overflow-x: hidden;">
        <el-table
          v-loading="repeatStudentDataLoading"
          :data="repeatStudentData"
          :cell-style="repeatStyle"
          element-loading-text="Loading"
          border
          fit>
          <el-table-column align="center" label="序号" width="55px">
            <template slot-scope="scope">
              {{ scope.$index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="学生姓名" align="center" prop="studentName"/>
          <el-table-column label="家长姓名" align="center" prop="parentName"/>
          <el-table-column label="手机号码" align="center" prop="parentPhone"/>
          <el-table-column label="关系" align="center" prop="familyRelationName"/>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="success" @click="cancel('repeatStudent')">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { getToken } from '@/utils/auth'
import { SYSTEM } from '@/api/apiMaps'
import { api } from '@/api/index'
import { regPhone } from '@/utils/validate'

export default {
  name: 'StudentParent',
  components: {
    Pagination
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写手机号'))
      } else {
        if (!regPhone(value)) {
          callback(new Error('请输入正确的手机号码'))
        } else {
          const repeat = this.dialogForm.form.parent.filter(item => item.parentAccount === value)
          if (repeat.length === 1) {
            callback()
          } else {
            callback(new Error('手机号重复'))
          }
        }
      }
    }
    return {
      list: null,
      listLoading: true,
      subListLoading: true,
      multipleTableList: null,
      multipleTableListLoading: true,
      uploadUrl: SYSTEM.SCHOOLMANAGE.STUDENTPARENT.IMPORTSTUDENT,
      total: 0,
      formInline: {
        schoolId: '',
        gradeId: '',
        classId: '',
        studentName: '',
        pageNum: 1,
        pageSize: 10
      },
      multipleTableFormInline: {
        schoolId: '',
        gradeId: '',
        classId: '',
        studentName: '',
        status: '',
        pageNum: 1,
        pageSize: 10
      },
      gradeOptions: [],
      classOptions: [],
      classDialogOptions: [],
      relationOptions: [],
      getRowKeys(row) {
        return row.studentId
      },
      expands: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6 // 如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
      dialogForm: {
        addStudentDialogVisible: false,
        editStudentDialogVisible: false,
        editParentDialogVisible: false,
        addParentDialogVisible: false,
        formWidth: '660px',
        formLabelWidth: '80px',
        title: '添加家长',
        form: {
          studentName: '',
          birthday: '',
          gender: 'man',
          gradeId: '',
          classId: '',
          parent: [{
            familyRelationCode: '',
            parentName: '',
            parentAccount: '',
            cardNum: ''
          }]
        },
        rules: {
          studentName: [
            { required: true, message: '请填写学生姓名', trigger: 'blur' }
          ],
          birthday: [
            { required: true, message: '请选择出生日期', trigger: 'change' }
          ],
          gradeId: [
            { required: true, message: '请选择年级', trigger: 'change' }
          ],
          classId: [
            { required: true, message: '请选择班级', trigger: 'change' }
          ],
          familyRelationCode: [
            { required: true, message: '请选择关系', trigger: 'change' }
          ],
          parentName: [
            { required: true, message: '请填写家长姓名', trigger: 'blur' }
          ],
          parentAccount: [
            { required: true, validator: checkPhone, trigger: 'blur' }
          ]
        }
      },
      ajaxLoading: null,
      studentId: null,
      parentId: null,
      currentRow: null,
      expandedRows: [],
      confirmAddStudentDialog: false,
      confirmAddStudentData: null,
      confirmAddStudentDataLoading: true,
      repeatStudentDialog: false,
      repeatStudentData: null,
      repeatStudentDataLoading: true
    }
  },
  computed: {
    ...mapGetters([
      'agentId'
    ]),
    headers() {
      return {
        'AGENT_SESSION_ID': getToken()
      }
    }
  },
  created() {
    this.formInline.schoolId = this.$route.query.schoolId
    this.multipleTableFormInline.schoolId = this.$route.query.schoolId
    this.uploadUrl += '?schoolId=' + this.$route.query.schoolId + '&agentId=' + this.agentId
    this.fetchData()
    this.getGradeAll()
    this.getDictionary()
  },
  methods: {
    onSubmit() {
      this.formInline.pageNum = 1
      this.fetchData()
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding:0'
    },
    repeatStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding: 5px 0'
    },
    headerStyle({ row, column, rowIndex, columnIndex }) {
      return 'padding: 0;'
    },
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      return 'color:#fff;background-color:#a0b5f1;'
    },
    fetchData() {
      this.listLoading = true
      api.getStudentList(this.formInline).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.list.forEach((value, index) => {
          value.children = null
        })
        this.listLoading = false
        this.updateParentList()
      }).catch(() => {
        this.listLoading = false
      })
    },
    getDictionary() {
      api.getDictionary('family_relation').then(response => {
        if (response.code === 10000) {
          this.relationOptions = response.data.family_relation
        }
      })
    },
    getGradeAll() {
      api.getAllGrade(this.formInline.schoolId).then(response => {
        if (response.code === 10000) {
          this.gradeOptions = response.data
        }
      })
    },
    getClass(type, gradeId) {
      this.classOptions = []
      this.classDialogOptions = []
      if (type === 'search') {
        this.formInline.classId = ''
      } else if (type === 'dialog') {
        this.dialogForm.form.classId = ''
      } else if (type === 'multipleTable') {
        this.multipleTableFormInline.classId = ''
      }
      api.getAllClass({ gradeId: gradeId }).then(response => {
        if (response.code === 10000) {
          if (type === 'search') {
            this.classOptions = response.data
          } else {
            this.classDialogOptions = response.data
          }
        }
      })
    },
    currentChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow
    },
    expandParent(row, expandedRows) {
      this.expandedRows = expandedRows
      if (!row.children) {
        row.loading = true
        api.getParentList({
          studentId: row.studentId
        }).then(response => {
          row.children = response.data
          row.loading = false
        }).catch(() => {
          row.loading = false
        })
      }
      // 只展开当前选项
      // if (expandedRows.length > 1) {
      //   expandedRows.shift()
      // }
    },
    updateParentList(currentRow) {
      if (currentRow) {
        currentRow.loading = true
        api.getParentList({
          studentId: currentRow.studentId
        }).then(response => {
          currentRow.children = response.data
          currentRow.loading = false
        }).catch(() => {
          currentRow.loading = false
        })
      } else {
        this.expandedRows.forEach((row, index) => {
          const matchingRow = this.list.find(item => item.studentId === row.studentId)
          matchingRow.loading = true
          api.getParentList({
            studentId: row.studentId
          }).then(response => {
            matchingRow.children = response.data
            matchingRow.loading = false
          }).catch(() => {
            matchingRow.loading = false
          })
        })
      }
    },
    editStudent(type, studentId) {
      if (type === 'add') {
        this.dialogForm.addStudentDialogVisible = true
      } else {
        api.getStudentDetail({
          studentId: studentId
        }).then(response => {
          if (response.code === 10000) {
            this.studentId = response.data.studentId
            this.dialogForm.form.studentName = response.data.studentName
            this.dialogForm.form.birthday = response.data.birthday
            this.dialogForm.form.gender = response.data.gender
            this.dialogForm.form.gradeId = response.data.gradeId
            this.getClass('dialog', response.data.gradeId)
            this.dialogForm.form.classId = response.data.classId
          }
        }).catch(() => {

        })
        this.dialogForm.editStudentDialogVisible = true
      }
    },
    deleteStudent(studentId) {
      this.$confirm('确定要删除当前学生(家长会同步删除)？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        api.deleteStudent({
          studentId: studentId
        }).then(response => {
          loading.close()
          if (response.code === 10000) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          } else {
            this.$message.error('删除失败')
          }
        }).catch(() => {
          loading.close()
        })
      }).catch(() => {
      })
    },
    editParent(type, studentId, parentId) {
      // this.expands = [studentId] // 添加成功后展开此项
      this.studentId = studentId
      this.parentId = parentId
      if (type === 'add') {
        this.dialogForm.addParentDialogVisible = true
      } else {
        this.dialogForm.editParentDialogVisible = true
        api.getParentDetail({
          studentId: studentId,
          parentId: parentId
        }).then(response => {
          if (response.code === 10000) {
            this.dialogForm.form.parent[0].familyRelationCode = response.data.familyRelationCode
            this.dialogForm.form.parent[0].parentName = response.data.parentName
            this.dialogForm.form.parent[0].parentAccount = response.data.parentAccount
            this.dialogForm.form.parent[0].cardNum = response.data.cardNum === 0 ? '' : response.data.cardNum
          }
        }).catch(() => {

        })
      }
    },
    deleteParent(studentId, parentId, index) {
      if (this.list[index].children.length === 1) {
        this.$confirm('当前学生下只有一个家长，删除家长即删除学生，是否确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          api.deleteStudent({
            studentId: studentId
          }).then(response => {
            loading.close()
            if (response.code === 10000) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.fetchData()
            } else {
              this.$message.error('删除失败')
            }
          }).catch(() => {
            loading.close()
          })
        }).catch(() => {

        })
      } else {
        this.$confirm('确定要删除当前家长？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          api.deleteParent({
            parentId: parentId,
            studentId: studentId
          }).then(response => {
            loading.close()
            if (response.code === 10000) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.updateParentList(this.currentRow)
            } else {
              this.$message.error('删除失败')
            }
          }).catch(() => {
            loading.close()
          })
        }).catch(() => {

        })
      }
    },
    confirm(type, formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          if (type === 'addStudent') {
            api.addStudentTestRepeat({
              ...this.dialogForm.form,
              ...{
                agentId: this.agentId,
                schoolId: this.formInline.schoolId
              }
            }).then(response => {
              loading.close()
              if (response.code === 10000) {
                if (response.data.code === 40002) {
                  this.confirmAddStudentDialog = true
                  this.confirmAddStudentDataLoading = false
                  this.confirmAddStudentData = response.data
                } else {
                  this.dialogForm.addStudentDialogVisible = false
                  this.fetchData()
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                }
              } else {
                this.$message.error('新增失败')
              }
            }).catch(() => {
              loading.close()
            })
          } else if (type === 'editStudent') {
            api.editStudent({
              studentId: this.studentId,
              studentName: this.dialogForm.form.studentName,
              birthday: this.dialogForm.form.birthday,
              gender: this.dialogForm.form.gender,
              gradeId: this.dialogForm.form.gradeId,
              classId: this.dialogForm.form.classId,
              agentId: this.agentId
            }).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.dialogForm.editStudentDialogVisible = false
                this.fetchData()
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$message.error('修改失败')
              }
            }).catch(() => {
              loading.close()
            })
          } else if (type === 'editParent') {
            api.editParent({
              studentId: this.studentId,
              parentId: this.parentId,
              familyRelationCode: this.dialogForm.form.parent[0].familyRelationCode,
              parentName: this.dialogForm.form.parent[0].parentName,
              parentAccount: this.dialogForm.form.parent[0].parentAccount,
              cardNum: this.dialogForm.form.parent[0].cardNum,
              agentId: this.agentId
            }).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.dialogForm.editParentDialogVisible = false
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.updateParentList(this.currentRow)
              } else {
                this.$message.error('修改失败')
              }
            }).catch(() => {
              loading.close()
            })
          } else if (type === 'addParent') {
            api.addParent({
              agentId: this.agentId,
              schoolId: this.formInline.schoolId,
              studentId: this.studentId,
              parent: this.dialogForm.form.parent
            }).then(response => {
              loading.close()
              if (response.code === 10000) {
                this.dialogForm.addParentDialogVisible = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.expands = [this.studentId]
                this.updateParentList(this.currentRow)
              } else {
                this.$message.error('添加失败')
              }
            }).catch(() => {
              loading.close()
            })
          } else {
            loading.close()
          }
        } else {
          return false
        }
      })
    },
    goOnAddStudent() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      api.addStudent({
        ...this.dialogForm.form,
        ...{
          agentId: this.agentId,
          schoolId: this.formInline.schoolId
        }
      }).then(response => {
        loading.close()
        if (response.code === 10000) {
          this.confirmAddStudentDialog = false
          this.dialogForm.addStudentDialogVisible = false
          this.fetchData()
          this.$message({
            message: '新增成功',
            type: 'success'
          })
        } else {
          this.$message.error(response.message)
        }
      }).catch(() => {
        loading.close()
      })
    },
    joinFamily(studentId) {
      this.$confirm('您是否确定加入该学生的家庭成员', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        api.joinFamily({
          ...{
            parent: this.dialogForm.form.parent,
            studentId: studentId,
            schoolId: this.formInline.schoolId
          }
        }).then(res => {
          loading.close()
          if (res.code === 10000) {
            this.confirmAddStudentDialog = false
            this.dialogForm.addStudentDialogVisible = false
            this.fetchData()
            this.$message({
              message: '加入成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.message)
          }
          console.log(res)
        }).catch(err => {
          loading.close()
          console.log(err)
        })
      }).catch(() => {
      })
    },
    cancel(type) {
      if (type === 'addStudent') {
        this.dialogForm.addStudentDialogVisible = false
      } else if (type === 'editStudent') {
        this.dialogForm.editStudentDialogVisible = false
      } else if (type === 'editParent') {
        this.dialogForm.editParentDialogVisible = false
      } else if (type === 'addParent') {
        this.dialogForm.addParentDialogVisible = false
      } else if (type === 'confirmAddStudent') {
        this.confirmAddStudentDialog = false
        this.dialogForm.addStudentDialogVisible = false
      } else if (type === 'repeatStudent') {
        this.repeatStudentDialog = false
      }
    },
    addParentDialog(type) {
      this.dialogForm.form.parent.push({
        familyRelationCode: '',
        parentName: '',
        parentAccount: '',
        cardNum: ''
      })
    },
    removeParentDialog(type, item) {
      const index = this.dialogForm.form.parent.indexOf(item)
      if (index !== -1) {
        this.dialogForm.form.parent.splice(index, 1)
      }
    },
    closeDialog(type) {
      for (const key in this.$refs) {
        if (key === 'multipleTable') {
          this.$refs.multipleTable.clearSelection() // 清除选择
        } else {
          this.$refs[key].resetFields()
        }
      }
      if (type === 'addStudent' || type === 'editParent' || type === 'addParent') {
        this.dialogForm.form.parent = [{
          familyRelationCode: '',
          parentName: '',
          parentAccount: '',
          cardNum: ''
        }]
      }
    },
    down(url) {
      api.download(url)
    },
    startUpload(event, file, fileList) {
      this.ajaxLoading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    onSuccess(response, file, fileList) {
      this.ajaxLoading.close()
      this.fetchData()
      if (response.code === 0 && response.data && response.data.length >= 0) {
        let html = ''
        response.data.forEach(function(value, index) {
          html += '<p>' + value + '</p>'
        })
        this.$alert(html, '错误信息', {
          confirmButtonText: '确定',
          dangerouslyUseHTMLString: true,
          callback: () => {
          }
        })
      } else if (response.code === 10000) {
        this.$message({
          message: '上传成功',
          type: 'success'
        })
      } else if (response.code === 40002) {
        this.repeatStudentDialog = true
        this.repeatStudentDataLoading = false
        this.repeatStudentData = response.data
      } else if (response.code === 0) {
        this.$message.error(response.message)
      }
    },
    onError(err, file, fileList) {
      console.log(err)
      this.$message({
        message: '导入失败',
        type: 'error'
      })
      this.ajaxLoading.close()
    }
  }
}
</script>

<style>
  .student-container .operation-container{
   margin-bottom: 20px;
  }
  .red {
    color: red !important;
  }
  .student-container .el-table__expanded-cell{
    padding: 15px;
  }
  .student-container .el-form-item{
    height: 33px;
    margin-bottom: 15px;
  }
  .student-container .addStudentDialog .el-dialog__body{
    padding: 0 20px !important;
  }
  .student-container .confirmStudentDialog .el-dialog__body{
    padding: 20px 20px !important;
  }
  .student-container .confirmStudentDialog .el-dialog__header{
    text-align: center;
    background-color: #7ccd4c;
  }
  .student-container .confirmStudentDialog .el-dialog__header .el-dialog__title{
    color: #fff !important;
  }
  .student-container .confirmStudentDialog .el-dialog__header .el-dialog__close{
    color: #fff;
  }
  .student-container td .cell{
    padding: 0 !important;
  }
  .student-container td tbody td{
    border-right: 0 !important;
  }
  .student-container .title{
    position: relative;
    color: #bdbbbb;
    font-weight: 700;
    padding-bottom: 10px;
    top: 10px;
    border-bottom: 1px dashed #ccc;
    margin-bottom: 25px;
  }
  .student-container .dialog-body{
    height: 360px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .student-container .box-card{
    width: 300px;
  }
  .student-container .box-card p{
    height: 20px;
    line-height: 20px;
    margin: 0;
    font-size: 12px;
    color: #b58585;
  }
  .student-container .box-card .el-card__body{
    padding: 5px;
  }
  .student-container .upload-demo{
    display: inline-block;
  }
  .student-container .el-icon-arrow-right:before{
    font-weight: 700;
    font-size: 16px;
    color: #409EFF;
  }
</style>
