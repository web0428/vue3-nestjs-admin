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
        :isShowOperation="true"
        :tableColumnConfig="tableColumnConfig"
        @handleSelectionChange="handleSelectionChange"
      >
        <template v-slot:operation>
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button @click="createTable(scope.row.id)">创建表</el-button>
              <el-button @click="findTable(scope.row.tableName)">查询表</el-button>
            </template>
          </el-table-column>
        </template>
      </BaseTable>
    </el-main>
    <el-footer>
      <BasePagination
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
        :totalPage="totalPage"
      />
    </el-footer>
  </el-container>

  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="30%">
    <BaseForm ref="BaseForm" :formItemConfigGroup="formItemConfigGroup" />
    <el-button @click="addFields">增加</el-button>
    <el-row v-for="(id,index) in tableFieldsArr" :key="id">
      <el-col :span="20">
        <BaseForm :ref="id" :formItemConfigGroup="tableFieldsFormItemConfigGroup" />
      </el-col>
      <el-col :span="4">
        <el-button type="danger" @click="deleteFields(index)">删除</el-button>
      </el-col>
    </el-row>
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
import tableApi from "@/api/table.api";
import moment from "moment";
const { v4: uuidv4 } = require('uuid');
import {
  FormItemConfigGroup,
  TableColumnConfig,
  FormType,
  BaseTableComponent,
  BaseFormComponent,
} from "@/component-interface";
import { ElMessage, ElMessageBox } from "element-plus";
export default defineComponent({
  name: "TableManage",
  components: { BaseTable, BasePagination, BaseForm },
  data() {
    return {
      selection: [],
      tableData: [],
      tableColumnConfig: [
        { label: "表名(中文)", prop: "tableCnName" },
        { label: "表名", prop: "tableName" },
        {
          label: "创建时间",
          prop: "createdDate",
          translate: (date: string) => {
            return moment(date).format("YYYY-DD-MM HH:mm:ss");
          },
        },
        {
          label: "更新时间",
          prop: "updatedDate",
          translate: (date: string) => {
            return moment(date).format("YYYY-DD-MM HH:mm:ss");
          },
        },
      ] as TableColumnConfig,
      formItemConfigGroup: [
        {
          label: "表名(中文)",
          prop: "tableCnName",
          type: FormType.ElInput,
        },
        {
          label: "表名",
          prop: "tableName",
          type: FormType.ElInput,
        },
      ] as FormItemConfigGroup,
      tableFieldsFormItemConfigGroup: [
        {
          label: "字段名(中文)",
          prop: "fieldCnName",
          type: FormType.ElInput,
        },
        {
          label: "字段名",
          prop: "fieldName",
          type: FormType.ElInput,
        },
        {
          label: "字段类型",
          prop: "fieldType",
          type: FormType.ElSelect,
          options: [
            {
              value: "varchar",
              label: "varchar",
            },
          ],
        },
      ] as FormItemConfigGroup,
      tableFieldsArr: [] as any[],
      queryFormItemConfigGroup: [
        {
          label: "表名(中文)",
          prop: "tableCnName",
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
      querys: {
        take: 10,
        skip: 0,
      },
    };
  },
  methods: {
    getQueryData() {
      return { tableCnName: "", date: [] };
    },
    getFormData() {
      return { tableName: "", tableCnName: "" };
    },
    getFieldFormData() {
      return { fieldName: "", fieldCnName: "", fieldType: "" };
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
      tableApi
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
    openFormNewDialog() {
      this.dialogTitle = "新建";
      this.dialogVisible = true;
      this.tableFieldsArr = [];
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
        this.tableFieldsArr = (this.selection[0] as any).customTableFields.map(() =>
          uuidv4()
        );
        this.$nextTick(() => {
          (this.$refs.BaseForm as BaseFormComponent).setFormData(
            this.selection[0]
          );
          (this.selection[0] as any).customTableFields.map((data: any, index: number) => {
            (this.$refs[this.tableFieldsArr[index]] as BaseFormComponent).setFormData(
              data
            )
          }
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
      data.customTableFields = this.tableFieldsArr.map((id) => {
        return (this.$refs[id] as BaseFormComponent).getFormData()
      });
      tableApi.create(data).then((res) => {
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
      data.customTableFields = this.tableFieldsArr.map((id) => {
        return (this.$refs[id] as BaseFormComponent).getFormData()
      });
      tableApi.update(data).then((res) => {
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
            tableApi.delete((this.selection[0] as any).id).then((res) => {
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
    addFields() {
      const id = uuidv4();
      this.tableFieldsArr.push(id);
      this.$nextTick(() => {
        (this.$refs[id] as BaseFormComponent
        ).setFormData(this.getFieldFormData());
      })
    },
    deleteFields(index: number) {
      this.tableFieldsArr.splice(index, 1);
    },
    createTable(id: string) {
      tableApi.createTable(id).then((res) => {
        const { code } = res.data;
        ElMessage({
          message: code === 0 ? "创建成功" : "创建失败",
          type: code === 0 ? "success" : "error",
        });
      });
    },
    findTable(tableName: string) {
      tableApi.findTable(tableName).then((res) => {
        const { code } = res.data;
        ElMessage({
          message: code === 0 ? "查询成功" : "查询失败",
          type: code === 0 ? "success" : "error",
        });
      });
    }
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
</style>
