<template>
  <el-container class="crud">
    <el-header>
      <div class="query-container">
        <el-row>
          <el-col :span="18">
            <BaseForm ref="QueryForm" :formItemConfigGroup="queryFormItemConfigGroup" />
          </el-col>
          <el-col :span="6">
            <div class="query-button">
              <el-button @click="resetQueryForm">重置</el-button>
              <el-button type="primary" @click="loadData">查询</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="operation-button">
        <el-button @click="openFormNewDialog">新建</el-button>
        <el-button @click="openFormEditDialog">编辑</el-button>
        <el-button @click="deleteById">删除</el-button>
      </div>
    </el-header>
    <el-main>
      <BaseTable
        ref="BaseTable"
        :isShowSelection="true"
        :tableColumnConfig="tableColumnConfig"
        @handleSelectionChange="handleSelectionChange"
      />
    </el-main>
    <el-footer>
      <BasePagination
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        :totalPage="totalPage"
      />
    </el-footer>
  </el-container>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="80%">
    <BaseForm ref="BaseForm" :formItemConfigGroup="formItemConfigGroup" />
    <div class="form-upload-container">
      <div class="form-upload-label">上传头像</div>
      <BaseUploadC ref="BaseUploadC" @uploadFile="uploadFile" />
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseTable from "@/components/base-table.vue";
import BaseForm from "@/components/base-form.vue";
import BasePagination from "@/components/base-pagination.vue";
import userApi from "@/api/user.api";
import { uploadApi } from "@/api/upload.api";
import moment from "moment";
import {
  FormItemConfigGroup,
  TableColumnConfig,
  FormType,
  BaseTableComponent,
  BaseFormComponent,
  BaseUploadComponent,
} from "@/component-interface";
import { ElMessage, ElMessageBox } from "element-plus";
import BaseUploadC from "@/components/base-upload-c.vue";
export default defineComponent({
  name: "UserManage",
  components: { BaseTable, BasePagination, BaseForm, BaseUploadC },
  data() {
    return {
      selection: [],
      tableData: [],
      tableColumnConfig: [
        { label: "用户名", prop: "username" },
        {
          label: "创建时间",
          prop: "createdDate",
          translate: (date: string) => {
            return moment(date).format("YYYY-DD-MM hh:mm:ss");
          },
        },
        {
          label: "更新时间",
          prop: "updatedDate",
          translate: (date: string) => {
            return moment(date).format("YYYY-DD-MM hh:mm:ss");
          },
        },
      ] as TableColumnConfig,
      formItemConfigGroup: [
        {
          label: "用户名",
          prop: "username",
          type: FormType.ElInput,
        },
        {
          label: "密码",
          prop: "password",
          type: FormType.ElInput,
        },
      ] as FormItemConfigGroup,
      queryFormItemConfigGroup: [
        {
          label: "用户名",
          prop: "username",
          type: FormType.ElInput,
          span: 6,
        },
        {
          label: "日期",
          prop: "date",
          type: FormType.ElDatePicker,
          span: 6,
          attrs: {
            type: "daterange",
            "range-separator": "到",
            "start-placeholder": "开始时间",
            "end-placeholder": "结束时间",
          },
        },
      ],
      dialogVisible: false,
      dialogTitle: "新建",
      totalPage: 10,
      avatarId: "",
      querys: {
        take: 10,
        skip: 0,
      },
    };
  },
  methods: {
    getQueryData() {
      return { username: "", date: [] };
    },
    initQueryData() {
      (this.$refs.QueryForm as BaseFormComponent).setFormData(
        this.getQueryData()
      );
    },
    loadData() {
      const queryFormData = (
        this.$refs.QueryForm as BaseFormComponent
      ).getFormData();
      const [startTime, endTime] = queryFormData.date;
      userApi
        .find({ ...this.querys, ...queryFormData, startTime, endTime })
        .then((res) => {
          this.tableData = res.data.content.result;
          this.totalPage = res.data.content.total;
          (this.$refs.BaseTable as BaseTableComponent).setTableData(
            this.tableData
          );
        });
    },
    resetQueryForm() {
      this.initQueryData();
      this.loadData();
    },
    handleSelectionChange(val: []) {
      this.selection = val;
    },
    handleCurrentChange(page: number) {
      this.querys.skip = (page - 1) * this.querys.take;
      this.loadData();
    },
    handleSizeChange(size: number) {
      this.querys.take = size;
      this.loadData();
    },
    getFormData() {
      return { username: "", password: "" };
    },
    openFormNewDialog() {
      this.avatarId = "";
      this.dialogTitle = "新建";
      this.dialogVisible = true;
      this.$nextTick(() => {
        (this.$refs.BaseForm as BaseFormComponent).setFormData(
          this.getFormData()
        );
      });
    },
    openFormEditDialog() {
      if (this.selection.length === 1) {
        this.dialogTitle = "编辑";
        this.dialogVisible = true;
        this.$nextTick(() => {
          this.avatarId = (this.selection[0] as any).avatarId;
          (this.$refs.BaseUploadC as BaseUploadComponent).setImageUrl(
            this.avatarId
          );
          (this.$refs.BaseForm as BaseFormComponent).setFormData(
            this.selection[0]
          );
        });
      } else {
        ElMessage({
          message: "请选且仅选择一行",
          type: "error",
        });
      }
    },
    saveOrUpdate() {
      if ("id" in (this.$refs.BaseForm as BaseFormComponent).getFormData()) {
        this.update();
      } else {
        this.save();
      }
    },
    save() {
      const data = (this.$refs.BaseForm as BaseFormComponent).getFormData();
      data.avatarId = this.avatarId;
      userApi.create(data).then((res) => {
        const { code } = res.data;
        ElMessage({
          message: code === 0 ? "保存成功" : "保存失败",
          type: code === 0 ? "success" : "error",
        });
        this.dialogVisible = false;
        this.loadData();
      });
    },
    update() {
      const data = (this.$refs.BaseForm as BaseFormComponent).getFormData();
      data.avatarId = this.avatarId;
      userApi.update(data).then((res) => {
        const { code } = res.data;
        ElMessage({
          message: code === 0 ? "保存成功" : "保存失败",
          type: code === 0 ? "success" : "error",
        });
        this.dialogVisible = false;
        this.loadData();
      });
    },
    deleteById() {
      if (this.selection.length === 1) {
        ElMessageBox.confirm(
          '确定要删除吗',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
          .then(() => {
            userApi.delete((this.selection[0] as any).id).then((res) => {
              const { code } = res.data;
              ElMessage({
                message: code === 0 ? "删除成功" : "删除失败",
                type: code === 0 ? "success" : "error",
              });
              this.loadData();
            });
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '取消',
            })
          })

      } else {
        ElMessage({
          message: "请选且仅选择一行",
          type: "error",
        });
      }
    },
    uploadFile(file: any) {
      const formData = new FormData();
      formData.append("file", file);
      uploadApi.upload(formData).then((res) => {
        const { code, content } = res.data;
        if (code === 0) {
          (this.$refs.BaseUploadC as BaseUploadComponent).setImageUrl(content);
          this.avatarId = content;
        }
      });
    },
  },
  mounted() {
    this.initQueryData();
    this.loadData();
  },
});
</script>

<style lang="scss" scoped>
.crud {
  padding: 0 20px;
  height: 100%;
  .query-container {
    padding: 20px;
    background: #f5f5f5;
    ::v-deep .el-form-item {
      margin-bottom: 0;
    }
  }
  .operation-button {
    padding: 10px 0;
  }
}
.form-upload-container {
  display: flex;
  .form-upload-label {
    width: 100px;
    text-align: right;
    padding-right: 12px;
    box-sizing: border-box;
  }
}
</style>
